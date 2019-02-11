import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import theme from './_theme.js'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  // headcss | normalize.css v8.0.0 | github.com/necolas/normalize.css */

  render () {
    return (
      <html lang="en">
        <Head>
          <title>Team Health Checker</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
          <style>{`button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}
html{box-sizing:border-box;} *,*:before,*:after{box-sizing:inherit;} 
body{margin:0;font-family:`+theme.font+`;overflow-x:hidden;} 
button,input[type=submit]{cursor:pointer;}
p{line-height:1.5;margin:0;}
ul{margin-top:0;}
select{padding:8px;}
h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6{text-rendering:optimizelegibility;margin:0;}
input,select,textarea,button{padding:4px;border:solid 2px #aed7ff;font-size:16px;font-family:'Nunito',sans-serif;}
select{-webkit-appearance:menulist;height:32px;}
table{border-collapse:collapse;}
input{text-align:inherit;padding-left:4px;}
button, button:focus { outline: none; border: none; }
:focus:not(:focus-visible) { outline: none; }
.rangeslider{margin:20px 0;position:relative;background:#e6e6e6;-ms-touch-action:none;touch-action:none}.rangeslider,.rangeslider .rangeslider__fill{display:block;box-shadow:inset 0 1px 3px rgba(0,0,0,.4)}.rangeslider .rangeslider__handle{background:#fff;border:1px solid #ccc;cursor:pointer;display:inline-block;position:absolute;box-shadow:0 1px 3px rgba(0,0,0,.4),0 -1px 3px rgba(0,0,0,.4)}.rangeslider .rangeslider__handle .rangeslider__active{opacity:1}.rangeslider .rangeslider__handle-tooltip{width:40px;height:40px;text-align:center;position:absolute;background-color:rgba(0,0,0,.8);font-weight:400;font-size:14px;transition:all .1s ease-in;border-radius:4px;display:inline-block;color:#fff;left:50%;transform:translate3d(-50%,0,0)}.rangeslider .rangeslider__handle-tooltip span{margin-top:12px;display:inline-block;line-height:100%}.rangeslider .rangeslider__handle-tooltip:after{content:' ';position:absolute;width:0;height:0}.rangeslider-horizontal{height:12px;border-radius:10px}.rangeslider-horizontal .rangeslider__fill{height:100%;background-color:#f1f1f1;border-radius:10px;top:0}.rangeslider-horizontal .rangeslider__handle{width:30px;height:30px;border-radius:30px;top:50%;transform:translate3d(-50%,-50%,0)}.rangeslider-horizontal .rangeslider__handle:after{content:' ';position:absolute;width:16px;height:16px;top:6px;left:6px;border-radius:50%;background-color:#dadada;box-shadow:0 1px 3px rgba(0,0,0,.4) inset,0 -1px 3px rgba(0,0,0,.4) inset}.rangeslider-horizontal .rangeslider__handle-tooltip{top:-55px}.rangeslider-horizontal .rangeslider__handle-tooltip:after{border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid rgba(0,0,0,.8);left:50%;bottom:-8px;transform:translate3d(-50%,0,0)}.rangeslider-vertical{margin:20px auto;height:150px;max-width:10px;background-color:transparent}.rangeslider-vertical .rangeslider__fill,.rangeslider-vertical .rangeslider__handle{position:absolute}.rangeslider-vertical .rangeslider__fill{width:100%;background-color:#f1f1f1;box-shadow:none;bottom:0}.rangeslider-vertical .rangeslider__handle{width:30px;height:10px;left:-10px;box-shadow:none}.rangeslider-vertical .rangeslider__handle-tooltip{left:-100%;top:50%;transform:translate3d(-50%,-50%,0)}.rangeslider-vertical .rangeslider__handle-tooltip:after{border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:8px solid rgba(0,0,0,.8);left:100%;top:12px}.rangeslider-reverse.rangeslider-horizontal .rangeslider__fill{right:0}.rangeslider-reverse.rangeslider-vertical .rangeslider__fill{top:0;bottom:inherit}.rangeslider__labels{position:relative;margin-bottom:8px;}.rangeslider-vertical .rangeslider__labels{position:relative;list-style-type:none;margin:0 0 0 24px;padding:0;text-align:left;width:250px;height:100%;left:10px}.rangeslider-vertical .rangeslider__labels .rangeslider__label-item{position:absolute;transform:translate3d(0,-50%,0)}.rangeslider-vertical .rangeslider__labels .rangeslider__label-item::before{content:'';width:10px;height:2px;background:#000;position:absolute;left:-14px;top:50%;transform:translateY(-50%);z-index:-1}.rangeslider__labels .rangeslider__label-item{position:absolute;font-size:14px;cursor:pointer;display:inline-block;top:10px;transform:translate3d(-50%,0,0)}
          `}</style>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}