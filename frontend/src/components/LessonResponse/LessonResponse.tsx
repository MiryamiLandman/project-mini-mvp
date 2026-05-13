import './LessonResponse.css';

interface Props {
  lesson: string;
}

const LessonResponse = ({ lesson }: Props) => {
  return (
    <div className="lesson-response">
      <h2>השיעור שלך:</h2>
      <p>{lesson}</p>
    </div>
  );
};

export default LessonResponse;
