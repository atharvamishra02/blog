import EditorPage from '../components/EditorPage';

export default function FoodEditor() {
  return (
    <EditorPage 
      title="Food Editor"
      category="food"
      placeholder="Write your food post here..."
      backgroundImage="/food.jpg"
    />
  );
}
