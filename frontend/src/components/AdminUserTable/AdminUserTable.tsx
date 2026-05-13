import './AdminUserTable.css';

interface IPrompt {
  _id: string;
  user_id: {
    name: string;
    phone: string;
  };
  category_id: {
    name: string;
  };
  sub_category_id: {
    name: string;
  };
  prompt: string;
  response: string;
  created_at: string;
}

interface Props {
  prompts: IPrompt[];
}

const AdminUserTable = ({ prompts }: Props) => {
  if (prompts.length === 0) {
    return <p>אין הנחיות במערכת</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>משתמש</th>
          <th>טלפון</th>
          <th>קטגוריה</th>
          <th>תת-קטגוריה</th>
          <th>הנחיה</th>
          <th>תאריך</th>
        </tr>
      </thead>
      <tbody>
        {prompts.map((prompt) => (
          <tr key={prompt._id}>
            <td>{prompt.user_id?.name}</td>
            <td>{prompt.user_id?.phone}</td>
            <td>{prompt.category_id?.name}</td>
            <td>{prompt.sub_category_id?.name}</td>
            <td>{prompt.prompt}</td>
            <td>{new Date(prompt.created_at).toLocaleDateString('he-IL')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUserTable;
