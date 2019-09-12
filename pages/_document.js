import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Global, css } from '@emotion/core'
import theme from '../components/Theme'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <body>
          <Global
            styles={css`
              button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.2;-webkit-text-size-adjust:100%}body{margin:0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}
              html{box-sizing:border-box;} *,*:before,*:after{box-sizing:inherit;} 
              body{margin:0;font-family:${theme.fonts.body};font-size:${theme.fontSizes[1]}px;} 
              button,input[type=submit]{cursor:pointer;background:${theme.colors.primary};color:white;padding:${theme.space[3]}px ${theme.space[4]}px;border-radius:${theme.radii[2]}px;border:none;font-size:${theme.fontSizes[2]}px;}
              p{line-height:${theme.lineHeights.body};margin:0 0 ${theme.space[3]}px;}
              ul{margin-top:0;}
              select{padding:8px;}
              h1,h2,h3,h4,h5,h6{text-rendering:optimizelegibility;line-height:${theme.lineHeights.heading};margin:0 0 ${theme.space[3]}px;}
              input,select,textarea{padding:4px;border:solid 2px #aed7ff;font-size:16px;font-family:${theme.fonts.body};}
              select{-webkit-appearance:menulist;height:32px;}
              table{border-collapse:collapse;}
              input{text-align:inherit;padding-left:4px;}
              a{color:${theme.colors.primary}; }
            `}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
