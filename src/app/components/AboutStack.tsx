import React from "react";
import MarkdownOriginal from "react-devicons/markdown/original";
import Html5Original from "react-devicons/html5/original";
import Css3Original from "react-devicons/css3/original";
import TailwindcssPlain from "react-devicons/tailwindcss/original";
import BootstrapOriginalWordmark from "react-devicons/bootstrap/original-wordmark";
import JavascriptPlain from "react-devicons/javascript/plain";
import TypescriptPlain from "react-devicons/typescript/plain";
import PhpPlain from "react-devicons/php/plain";
import ReactOriginalWordmark from "react-devicons/react/original-wordmark";
import NextjsOriginal from "react-devicons/nextjs/original-wordmark";
import NpmOriginalWordmark from "react-devicons/npm/original-wordmark";
import JavaOriginalWordmark from "react-devicons/java/original-wordmark";
import CsharpOriginal from "react-devicons/csharp/original";
import CplusplusOriginal from "react-devicons/cplusplus/original";
import DotnetcoreOriginal from "react-devicons/dotnetcore/original";
import MicrosoftsqlserverPlainWordmark from "react-devicons/microsoftsqlserver/plain-wordmark";
import PythonOriginalWordmark from "react-devicons/python/original-wordmark";
import DartPlainWordmark from "react-devicons/dart/plain-wordmark";
import FlutterOriginal from "react-devicons/flutter/original";
import FirebasePlainWordmark from "react-devicons/firebase/plain-wordmark";
import WordpressPlainWordmark from "react-devicons/wordpress/plain-wordmark";
import AndroidstudioOriginal from "react-devicons/androidstudio/original";
import UnrealengineOriginalWordmark from "react-devicons/unrealengine/original-wordmark";
import UnityOriginal from "react-devicons/unity/plain-wordmark";
import BlenderOriginal from "react-devicons/blender/original";
import GitPlainWordmark from "react-devicons/git/plain-wordmark";
import GithubOriginal from "react-devicons/github/original";
import AzureOriginalWordmark from "react-devicons/azure/original-wordmark";

const AboutStack = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {/* <h1 className="text-5xl font-bold">Languages & Frameworks</h1> */}
        <div className="flex flex-wrap flex-row py-6 px-8 mx-14 items-center justify-center space-x-4 space-y-4">
          <MarkdownOriginal color="#FFFFFF" size="8rem" />
          <Html5Original size="8rem"/>
          <Css3Original size="8rem"/>
          <TailwindcssPlain size="8rem"/>
          <BootstrapOriginalWordmark size="8rem"/>
          <PhpPlain size="8rem"/>
          <JavascriptPlain size="8rem"/>
          <TypescriptPlain size="8rem"/>
          <ReactOriginalWordmark size="8rem"/>
          <NextjsOriginal color="white" size="8rem"/>
          <NpmOriginalWordmark size="8rem"/>
          <JavaOriginalWordmark size="8rem"/>
          <CplusplusOriginal size="8rem"/>
          <CsharpOriginal size="8rem"/>
          <DotnetcoreOriginal size="8rem"/>
          <MicrosoftsqlserverPlainWordmark color="#FFFFFF" size="8rem"/>
          <PythonOriginalWordmark size="8rem"/>
          <DartPlainWordmark size="8rem"/>
          <FlutterOriginal size="8rem"/>
          <FirebasePlainWordmark size="8rem"/>
          <WordpressPlainWordmark color="#3179A1" size="8rem"/>
          <AndroidstudioOriginal size="8rem"/>
          <UnrealengineOriginalWordmark color="#FFFFFF" size="8rem"/>
          <UnityOriginal color="white" size="8rem"/>
          <BlenderOriginal size="8rem"/>
          <GitPlainWordmark size="8rem"/>
          <GithubOriginal color="white" size="8rem"/>
          <AzureOriginalWordmark size="8rem"/>
        </div>
      </div>
    </>
  );
};
export default AboutStack;
