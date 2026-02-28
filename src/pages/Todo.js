/* 
  We are storing our title and headers into an object for easy
  deconstruction when we pass them as props to our Home component.
  See Grocery.js for comparison.
*/
const todoList = {
  title: "Todo List",
  header1: "Task",
  header2: "Description",
};

function Todo() {
  // TODO: Reuse the Home component to render the list view
  return <h1>This is the Todo page! NEW CHANGE </h1>;
}

export default Todo;
