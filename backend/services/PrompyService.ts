import { OpenAI } from 'openai';
import { Prompt, IPrompt } from '../models/Prompt';
import { SubCategory } from '../models/SubCategory';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createAIDrivenLesson(
  userId: string, 
  subCategoryId: string, 
  userPrompt: string
): Promise<IPrompt> {
  
  const subCat = await SubCategory.findById(subCategoryId).populate('category').exec();
  if (!subCat) throw new Error("תת-קטגוריה לא נמצאה");

  const categoryName = (subCat.category as any).name;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        { 
          role: "system", 
        content: `אתה מורה מקצועי. הנושא הנלמד הוא ${categoryName} - ${subCat.name}. 
עליך לייצר תוכן לימודי בעברית בצורה מכובדת, ברורה ומעניינת.
התוכן צריך להיות בצורה נוחה ללמידה עם דוגמאות והסברים מפורטים.
הקפד על ניסוח ברור, שימוש בשפה פשוטה והסברים מפורטים כדי להבטיח שהלומד יבין את החומר לעומק. 
השתמש בדוגמאות מעשיות כדי להמחיש את הנקודות המרכזיות ולחזק את ההבנה של הלומד. 
הקפד על מבנה מסודר של התוכן, עם כותרות משנה ופסקאות קצרות כדי להקל על הקריאה והלמידה.` 
        },
        { 
          role: "user", 
          content: userPrompt 
        }
      ],
    });

    const responseText = response.choices[0].message.content || '';

    const newPromptEntry = new Prompt({
      user_id: userId,
      category_id: subCat.category,
      sub_category_id: subCategoryId,
      prompt: userPrompt,
      response: responseText
    });

    return await newPromptEntry.save();

  } catch (error) {
    console.error("OpenAI Error:", JSON.stringify(error));
    throw new Error("נכשלה יצירת השיעור");
  }
}
async function getPromptById(promptId: string): Promise<IPrompt | null> {
  return await Prompt.findById(promptId)
    .populate('category_id')
    .populate('sub_category_id')
    .exec();
}
async function getAllPromptsAdmin(): Promise<IPrompt[]> {
  return await Prompt.find()
    .populate('user_id', 'name phone')
    .populate('category_id', 'name')
    .populate('sub_category_id', 'name')
    .sort({ created_at: -1 }) 
    .exec();
}
async function deletePrompt(promptId: string, userId: string): Promise<boolean> {
  const result = await Prompt.deleteOne({ _id: promptId, user_id: userId }).exec();
  return result.deletedCount > 0;
}
async function getUserStats(userId: string) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const stats = await Prompt.aggregate([
    { $match: { user_id: userObjectId } }, 
    {
      $facet: {
  
        totalCount: [{ $count: "count" }],
        
  
        byCategory: [
          {
            $group: {
              _id: "$category_id",
              count: { $sum: 1 }
            }
          },
          {
            $lookup: { 
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "categoryDetails"
            }
          },
          { $unwind: "$categoryDetails" },
          {
            $project: {
              _id: 0,
              name: "$categoryDetails.name",
              count: 1
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);

  const total = stats[0].totalCount[0]?.count || 0;
  const categories = stats[0].byCategory || [];

  return {
    totalLessons: total,
    favoriteCategory: categories.length > 0 ? categories[0].name : "טרם נלמד",
    categoryBreakdown: categories
  };
}
async function getUserPrompts(userId: string): Promise<IPrompt[]> {
  return await Prompt.find({ user_id: userId })
    .populate('category_id', 'name')
    .populate('sub_category_id', 'name')
    .sort({ created_at: -1 })
    .exec();
}
export { createAIDrivenLesson, getPromptById, getAllPromptsAdmin, deletePrompt, getUserStats, getUserPrompts };
