import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Result } from "./App";
import LoadingSpinner from "./LoadingSpinner";

interface ResultSet {
  question: string;
  result: Result;
  showContext: boolean;
  answerOptions: { [key: string]: string };
  answerType: string;
  onTabClick: (arg: string) => void;
  onButtonClick: () => void;
  onContextClick: () => void;
}

export const ResultBar = (props: ResultSet) => {
  return (
    <>
      <div style={{ backgroundColor: "#242b46" }} className="w-full p-2">
        <div
          style={{ backgroundColor: "#242b46" }}
          className=" w-full h-full flex flex-col "
        >
          <div className="w-full ">
            <h2 className="  text-white p-4">{props.question}</h2>
          </div>
          <ResultSubSection {...props} />
        </div>
      </div>
    </>
  );
};

export const FurtherQuestionsBar = (props: any) => {
  return (
    <>
      {props.suggestions && props.suggestions.length > 0 && (
        <>
          <div
            style={{ backgroundColor: "#242b46" }}
            className="w-full p-2 my-1"
          >
            <p className=" px-4 text-xs text-zinc-200 p-2">Further questions</p>
            <div className="px-4 py-2 text-white flex flex-row gap-3 flex-wrap ">
              {props.suggestions.map((text: any) => {
                return (
                  <QuestionPrompt
                    askQuestion={props.askQuestion}
                    question={text}
                  />
                );
              })}
              {/* <QuestionPrompt question={"What is an Apple ?"} />
          <QuestionPrompt question={"What is an Orange ?"} />
          <QuestionPrompt question={"What is a Banana ?"} /> */}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const OptionsBar = (props: any) => {
  return (
    <>
      <div style={{ backgroundColor: "#242b46" }} className="w-full p-2 my-1">
        <p className=" px-4 text-xs text-zinc-200 p-2">Actions</p>
        <div className="px-4 py-2 text-white flex flex-row gap-3 flex-wrap gap-12 ">
          <div className="flex flex-row gap-3 flex-wrap">
            <OptionItem color={"bg-yellow-700"} text={"Select"} />
          </div>
          <div className="flex flex-row gap-3 flex-wrap">
            <OptionItem color={"bg-red-700"} text={"Discard"} />
            <OptionItem color={"bg-blue-700"} text={"Accept All"} />
          </div>
        </div>
      </div>
    </>
  );
};

export const OptionItem = (props: any) => {
  return (
    <div
      className={`${props.color} px-3 py-1 w-fit rounded ring ring-gray-500 ring-1`}
    >
      {props.text}
    </div>
  );
};

export const QuestionPrompt = (props: any) => {
  return (
    <button
      onClick={() => {
        props.askQuestion(props.question);
      }}
      className="bg-blue-700 px-3 py-1 w-fit rounded ring ring-white ring-1"
    >
      {props.question}
    </button>
  );
};

const AnswerContent = (props: ResultSet) => {
  return (
    <>
      <div
        style={{ backgroundColor: "#444e62" }}
        className="w-full h-full flex flex-col"
      >
        <div className="flex flex-row justify-between">
          <p className="text-xs text-zinc-200 p-2">Answer</p>
          <button
            onClick={() => props.onContextClick()}
            className="h-full px-3 py-1 text-sm  bg-indigo-800 text-white"
          >
            {props.showContext ? "Show Answer" : "Show Context"}
          </button>
        </div>

        <div className="w-full h-full text-white p-2">
          {props.result ? (
            <>
              {props.showContext ? props.result.context : props.result.answer}
            </>
          ) : (
            <div className="w-100 h-100 flex flex-col items-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Tab = (props: {
  selected: boolean;
  name: string;
  val: string;
  onTabClick: (arg: string) => void;
}) => {
  return (
    <>
      <button
        onClick={() => props.onTabClick(props.val)}
        className={`text-xs text-white px-2 ${
          props.selected ? "bg-blue-700" : "bg-gray-700"
        }`}
      >
        {props.name}
      </button>
    </>
  );
};

const ResultSubSection = (props: ResultSet) => {
  return (
    <>
      <div className="p-4 h-full flex flex-col">
        <div className="h-7  gap-1 flex flex-row">
          {Object.keys(props.answerOptions).map((opt: any) => {
            return (
              <Tab
                key={opt}
                onTabClick={props.onTabClick}
                selected={props.answerType == opt}
                name={props.answerOptions[opt]}
                val={opt}
              />
            );
          })}
        </div>
        <div>
          <AnswerContent {...props} />
        </div>
      </div>
    </>
  );
};
