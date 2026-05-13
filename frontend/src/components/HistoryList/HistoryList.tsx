import './HistoryList.css';

interface ICategoryBreakdown {
  name: string;
  count: number;
}

interface IStats {
  totalLessons: number;
  favoriteCategory: string;
  categoryBreakdown: ICategoryBreakdown[];
}

interface Props {
  stats: IStats | null;
}

const HistoryList = ({ stats }: Props) => {
  if (!stats || stats.totalLessons === 0) {
    return <p>עדיין לא למדת כלום, בוא נתחיל!</p>;
  }

  return (
    <div className="history-list">
      <h2>פירוט לפי קטגוריה:</h2>
      {stats.categoryBreakdown.map((cat) => (
        <div className="history-item" key={cat.name}>
          <span>{cat.name}</span>
          <span>{cat.count} שיעורים</span>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
