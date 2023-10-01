"use client";
import { useState, useEffect } from "react";
import type { Chapter } from "@/app/types/chapter";
import type { Example } from "@/app/types/example";
import Navbar from "@/app/navbar";
import LoadingScreen from "@/app/loading";
import Head from "next/head";

export default function Page({ params }: { params: { slug: string } }) {
  const [chapter, setChapter] = useState<Chapter | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/chapter/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw Error("Fetch error");
        return res.json();
      })
      .then((res) => {
        setChapter(res.chapter);
        setLoading(false);
      })
      .catch((_) => {
        setLoading(false);
      });
  }, [params.slug]);

  if (isLoading) return (
    <div className="h-screen w-screen p-4 pb-3 pt-0">
      <Navbar />
      <LoadingScreen />
    </div>
  )
  if (!chapter) return <p>Something went wrong</p>;
  return (
    <>
    <div className="w-screen min-h-screen flex flex-col p-4 pt-0 pb-3">
      <Navbar />
      <div className=" flex flex-col font-pixel leading-7 justify-between grow">
        <div className="flex flex-col gap-3 border-b-gray-600 border-b-2 border-dashed grow pt-5 pb-8">
          <span className="text-3xl font-pixel font-semibold leading-10">
            {chapter.title}
          </span>
          <pre className="font-pixel font-light text-xl overflow-x-auto whitespace-pre-wrap break-words text-gray-400">
            {chapter.description}
          </pre>
          <div className="flex flex-col gap-5">
            {chapter.examples.map((example, key) => (
              <Example example={example} key={key} />
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-between pt-3">
          <div>
            {chapter.prevTitle !== "" && (
              <a
                href={`/chapter/${chapter.id - 1}`}
                className="flex flex-row text-gray-500 hover:text-gray-300"
              >
                <div className="flex flex-col">
                  <span className="text-md text-end">Previous</span>
                  <div className="flex gap-3">
                    <span className="text-lg">{"<"}</span>
                    <span className="text-gray-300 font-medium text-xl">
                      {chapter.prevTitle}
                    </span>
                  </div>
                </div>
              </a>
            )}
          </div>
          <div>
            {chapter.nextTitle !== "" && (
              <a
                href={`/chapter/${chapter.id + 1}`}
                className="flex flex-row text-gray-500 hover:text-gray-300"
              >
                <div className="flex flex-col">
                  <span className="text-md">Next</span>
                  <div className="flex gap-3">
                    <span className="text-gray-300 text-xl font-medium">
                      {chapter.nextTitle}
                    </span>
                    <span className="text-lg">{">"}</span>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function Example(props: { example: Example }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="leading-10 font-pixel font-thin text-2xl">
        {props.example.title}
      </span>
      {props.example.code && (
        <pre className="p-4 bg-white bg-opacity-10 rounded-sm text-md font-pixel text-xl text-gray-300">
          {props.example.code}
        </pre>
      )}
      {props.example.description && (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words text-gray-400 font-pixel text-xl">
          {props.example.description}
        </pre>
      )}
    </div>
  );
}

