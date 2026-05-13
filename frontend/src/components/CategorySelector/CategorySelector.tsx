import './CategorySelector.css';

interface ICategory {
  _id: string;
  name: string;
}

interface ISubCategory {
  _id: string;
  name: string;
}

interface Props {
  categories: ICategory[];
  subCategories: ISubCategory[];
  selectedCategory: string;
  selectedSubCategoryId: string;
  onCategoryChange: (categoryName: string) => void;
  onSubCategoryChange: (subCategoryId: string) => void;
}

const CategorySelector = ({
  categories,
  subCategories,
  selectedCategory,
  selectedSubCategoryId,
  onCategoryChange,
  onSubCategoryChange,
}: Props) => {
  return (
    <div className="category-selector">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">בחר קטגוריה</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <select
          value={selectedSubCategoryId}
          onChange={(e) => onSubCategoryChange(e.target.value)}
        >
          <option value="">בחר תת-קטגוריה</option>
          {subCategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategorySelector;
