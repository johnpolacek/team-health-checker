/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ children }) => (
  <>
	  <main>
	    {children}
	  </main>
    <footer sx={{minHeight:'10vh',textAlign:'center',fontSize:0,bg:'#f4f4f4',pt:4,fontWeight:500}}>
      <p>
        Built by <a href="https://johnpolacek.com">John Polacek</a>.{" "}&nbsp;
        Open Sourced on <a href="https://github.com/johnpolacek/team-health-checker">Github</a>.{" "}&nbsp;
        Follow <a href="https://johnpolacek.com/johnpolacek">@johnpolacek</a>.
      </p>
    </footer>
	</> 
)
