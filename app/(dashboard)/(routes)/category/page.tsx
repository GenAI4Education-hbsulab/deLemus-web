import MainPage from "@/components/category/main";
const CategoriesPage = () => {
  return (
    <div className="m-6 flex flex-col gap-2">
      <h1 className="text-4xl font-bold">Courses</h1>
      <h2 className="text-lg">All Development Courses</h2>
      <MainPage />
    </div>
  );
};

export default CategoriesPage;
