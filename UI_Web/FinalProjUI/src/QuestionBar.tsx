import LoadingSpinner from "./LoadingSpinner";

export const QuestionBar = (props: any) => {
  return (
    <form action="#">
      <div className="fixed px-8  bottom-4 w-full h-12">
        <div className="rounded shadow bg-zinc-700 shadow-gray-600 w-full h-full flex flex-row">
          <div className="w-full relative ">
            <input
              value={props.text}
              onChange={(event) => props.setText(event.target.value)}
              type="text"
              className="w-full bg-zinc-600 text-white text-justify text-xl h-full p-3"
            ></input>
            <div className="absolute right-0 top-0 scale-50">

              {props.loading && <LoadingSpinner  />}
            </div>
          </div>

          <button
            type="submit"
            onClick={(ev: any) => {
              ev.preventDefault();
              props.onButtonClick();
            }}
            className="w-24  h-full text-white"
          >
            Answer
          </button>
        </div>
      </div>
    </form>
  );
};

// const LoadingSpinner = (props: any) => {
//   return (
//     <div
//       className="spinner-container"
//     >
//       <div className="loading-spinner"></div>
//     </div>
//   );
// };
