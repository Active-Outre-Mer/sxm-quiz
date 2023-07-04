"use client";
import { Badge, Command } from "@aomdev/ui";
import { useState, useEffect } from "react";
import { SearchIcon, FileText, CircleDot, Newspaper, List } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Quiz } from "@/types/database.types";
import type { Article } from "contentlayer/generated";
import { ScrollArea } from "@aomdev/ui";

type PropTypes = {
  multipleChoice: Quiz[];
  nameAll: Quiz[];
  articles: Article[];
};

export default function Searchbar(props: PropTypes) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const openMenu = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onBackspace = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        setPage("");
      }
    };
    window.addEventListener("keydown", openMenu);
    window.addEventListener("keydown", onBackspace);
    return () => {
      window.removeEventListener("keydown", openMenu);
      window.removeEventListener("keydown", onBackspace);
    };
  }, []);

  const onNavigate = (value: string) => {
    router.push(`/${value}`);
    setOpen(false);
    setPage("");
  };

  const onToggle = (val: boolean) => {
    setPage("");
    setOpen(val);
  };

  const onSelect = (value: string) => setPage(value);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md items-center flex gap-1 px-4 min-w-fit text-neutral-500 h-8 ring-1 ring-neutral-200"
      >
        <SearchIcon size={14} className="text-neutral-500" />
        Search...
        <kbd className="text-xs bg-neutral-200/30 ring-1 ring-neutral-100 inline-block ml-6 p-[1px] rounded-sm">
          Ctrl K
        </kbd>
      </button>
      <Command
        contentProps={{ className: "w-2/4 relative pb-6 overflow-hidden", blur: true }}
        open={open}
        onOpenChange={onToggle}
      >
        <Command.Input placeholder="Search" />
        <div className="flex gap-2 px-4 mb-2">
          <Badge variant={"light"} size={"sm"}>
            Home
          </Badge>
          {page && (
            <Badge variant={"light"} size={"sm"} className="capitalize">
              {page}
            </Badge>
          )}
        </div>
        <Command.List>
          <ScrollArea style={{ height: window.screen.height / 2 }} className="-mx-4 px-4">
            {page.toLowerCase() === "multiple choice" && (
              <Quiz onNavigate={onNavigate} quizzes={props.multipleChoice} />
            )}
            {page.toLowerCase() === "name all" && <Quiz onNavigate={onNavigate} quizzes={props.nameAll} />}
            {page.toLowerCase() === "articles" && (
              <Articles onNavigate={onNavigate} articles={props.articles} />
            )}
            {!page && <Default onSelect={onSelect} />}
          </ScrollArea>
        </Command.List>
        <div className="absolute bg-white px-4 text-sm flex items-center justify-between bottom-0 left-0 h-10 border-t w-full">
          <span>LOGO</span>
          <div className="flex gap-2 items-center">
            <span>
              <span className="font-medium">Close</span>{" "}
              <kbd className="text-xs bg-neutral-200/30 ring-1 ring-neutral-100 inline-block  p-[1px] rounded-sm">
                ESC
              </kbd>
            </span>
            <div role="seperator" className="h-4 w-[2px] bg-neutral-200" />
            <span>
              <span className="font-medium">Back </span>{" "}
              <kbd className="text-xs bg-neutral-200/30 ring-1 ring-neutral-100 inline-block  p-[1px] rounded-sm">
                CTRL /
              </kbd>
            </span>
          </div>
        </div>
      </Command>
    </>
  );
}

type Props = { quizzes: Quiz[]; onNavigate: (val: string) => void };

function Quiz({ onNavigate, quizzes }: Props) {
  return (
    <>
      {quizzes.map(quiz => {
        return (
          <Command.Item onSelect={onNavigate} value={`quiz/${quiz.slug}`} key={quiz.id}>
            {quiz.title}
          </Command.Item>
        );
      })}
    </>
  );
}
type ArticleProps = Pick<PropTypes, "articles"> & { onNavigate: (val: string) => void };

function Articles({ articles, onNavigate }: ArticleProps) {
  return (
    <>
      {articles.map(article => {
        return (
          <Command.Item
            value={`learn/${article.category}/${article.slug}`}
            onSelect={onNavigate}
            key={article.slug}
          >
            {article.title}
          </Command.Item>
        );
      })}
    </>
  );
}

function Default({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <>
      <Command.Group heading="Quizzes">
        <Command.Item onSelect={onSelect} value="Multiple Choice">
          <CircleDot size={16} className="inline-block mr-2 text-gray-600" /> Multiple Choice
        </Command.Item>
        <Command.Item onSelect={onSelect} value="Name All">
          <List size={16} className="inline-block mr-2 text-gray-600" />
          Name All
        </Command.Item>
      </Command.Group>
      <Command.Seperator />
      <Command.Group heading="Resources">
        <Command.Item onSelect={onSelect} value="Blogs">
          <Newspaper size={16} className="inline-block mr-2 text-gray-600" />
          Blogs
        </Command.Item>
        <Command.Item onSelect={onSelect} value="Articles">
          <FileText size={16} className="inline-block mr-2 text-gray-600" /> Articles
        </Command.Item>
      </Command.Group>
    </>
  );
}