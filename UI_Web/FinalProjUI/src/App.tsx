import React, { EffectCallback, useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { FurtherQuestionsBar, ResultBar, OptionsBar } from "./AnswerSection";
import { QuestionBar } from "./QuestionBar";
import { useWatcher } from "./helperHooks";

export interface Result {
  question: string;
  answerType: string;
  answer: string;
  context: string;
  suggestions?: string[];
}

type Nullable<T> = T | null;

const url = "http://127.0.0.1:105/";
const endpoint = (name: string) => `${url}${name}`;

/**
  API needs following:
    - question
    - question Type
  API returns following: 
    - question
    - context
    - answer type
    - answer
  
    Need to adjust for multiple questions: 
      - 

 */

const answerApiCall = async ({
  question,
  questionType,
  url = "http://127.0.0.1:105/",
}: {
  question: string;
  questionType: string;
  url: string;
}) => {
  const body = {
    question,
    questionType,
  };
  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 400) {
    throw "Could not fetch result!";
  }
  const result = await res.json();
  return result;
};

// const defaultAnswer: Result = {
//   question: "What is Electricity?",
//   answerType: "Summarization",
//   answer: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda dolor cupiditate, harum, tempora reiciendis illum doloremque officiis necessitatibus consectetur facere cum nobis fugiat aut adipisci labore dignissimos obcaecati delectus suscipit!`,
//   context: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit quos expedita obcaecati accusantium sint amet repellat. Culpa totam, ex iusto ab omnis sit repudiandae sed autem assumenda maxime veritatis.
//   Natus molestiae obcaecati quae porro quam earum expedita? Explicabo quae repellendus necessitatibus soluta reprehenderit rem similique expedita? Totam recusandae necessitatibus id a laborum vel, repudiandae porro provident maiores alias officia!`,
// };

const convertResponse = (res: any) => {
  return {
    [res.answerType]: {
      context: res.scraped,
      answerType: res.answerType,
      answer: res.answerType == "factoid" ? res.answer.answer : res.answer,
      suggestions: res.suggestions ?? [],
    },
  };
};

const useApi = (apiCall: any, params: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]: [any, any] = useState();
  const [result, setResult]: [any, any] = useState();
  const [refresh, setRefresh] = useState(false);

  const handleApiCall = async () => {
    setLoading(true);
    try {
      const response = await apiCall(params);
      setResult({ ...result, ...convertResponse(response) });
      setLoading(false);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err);
      setLoading(false);
    }
  };

  useWatcher(() => {
    handleApiCall();
  }, [refresh]);

  return [loading, error, () => setRefresh(!refresh), result];
};

function AnswerSection(props: any) {
  const answerOptions = { factoid: "Factoid", summarization: "Summarization" };
  const [text, setText] = useState(props.text);
  const [option, setOption] = useState(Object.keys(answerOptions)[1]);
  console.log(option);
  const [showContext, setShowContext] = useState(false);
  const [loading, error, triggerRefresh, response] = useApi(answerApiCall, {
    question: text,
    questionType: option,
  });
  console.log(response);
  const resultsAvailable = response && Object.keys(response).length > 0;
  const hasCurrentResult =
    resultsAvailable &&
    response[option] &&
    Object.keys(response[option]).length != 0;
  const result: Result = hasCurrentResult ? response[option] : null;
  const hasSomeResult = !loading && resultsAvailable;
  const loadingCurrentResult = loading && resultsAvailable;

  const onTabClick = (newVal: string) => {
    if (!loading) {
      setOption(newVal);
      setShowContext(false);
    }
  };

  useEffect(() => {
    if (!hasCurrentResult) {
      triggerRefresh();
    }
  }, [option]);

  const onContextClick = () => {
    if (!loading) {
      setShowContext(!showContext);
    }
  };

  const onButtonClick = () => {
    triggerRefresh();
  };
  if (result) console.log(result["suggestions"]);
  return (
    <>
      {!error && (
        <>
          <ResultBar
            question={text}
            onContextClick={onContextClick}
            showContext={showContext}
            onButtonClick={onButtonClick}
            onTabClick={onTabClick}
            result={result}
            answerType={option}
            answerOptions={answerOptions}
          />
          {result && (
            <FurtherQuestionsBar
              askQuestion={props.askQuestion}
              suggestions={result["suggestions"]}
            />
          )}
        </>
      )}
      {error && <Error />}
    </>
  );
}

const App = () => {
  const [text, setText] = useState("");
  const [answerComponents, setAnswerComponents] = useState<JSX.Element[]>([]);

  const newQuestion = (question: string) => {
    console.log("Ask Question initiated");
    const newAnswerComp = (
      <AnswerSection askQuestion={askQuestion} text={question} />
    );
    const newAnswerComps = [...answerComponents, newAnswerComp];
    console.log(newAnswerComps);
    setAnswerComponents((prev) => [...prev, newAnswerComp]);
  };

  const askQuestion = (question: string) => {
    newQuestion(question);
  };

  const onClick = () => {
    newQuestion(text);
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [answerComponents]);

  console.log(answerComponents);
  return (
    <>
      <QuestionBar
        onButtonClick={onClick}
        text={text}
        setText={(text: string) => setText(text)}
      />
      {answerComponents.map((comp) => comp)}
      <div className="h-20 w-full p-5"></div>
    </>
  );
};

const Error = () => {
  return <h1 className="text-white text-4xl p-5">Error</h1>;
};

export default App;
