import React from "react";
import { useTheme, Theme } from "@material-ui/core/styles";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import styleDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import styleLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";

interface Props {
  language: string;
  children: string;
  customStyle?: object;
}

// Theme aware syntax-highlighter component.
export default function SyntaxHighlighter(props: Props) {
  const theme = useTheme<Theme>();
  const style = theme.palette.type === "dark" ? styleDark : styleLight;
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
