import React from "react";
import { useTheme, Theme } from "@material-ui/core/styles";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import styleDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import styleLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";
import { isDarkTheme } from "../theme";

interface Props {
  language: string;
  children: string;
  customStyle?: object;
}

// Theme aware syntax-highlighter component.
export default function SyntaxHighlighter(props: Props) {
  const theme = useTheme<Theme>();
  const style = isDarkTheme(theme) ? styleDark : styleLight;
  return (
    <ReactSyntaxHighlighter
      language={props.language}
      style={style}
      customStyle={props.customStyle}
    >
      {props.children}
    </ReactSyntaxHighlighter>
  );
}
