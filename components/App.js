/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({ children }) => (
  <>
	  <main>
	    {children}
	  </main>
    <footer sx={{minHeight:'10vh',textAlign:'center',fontSize:0,bg:'#f4f4f4',pt:4}}>
      <p>
        Built by <a href="https://johnpolacek.com">John Polacek</a>.{" "}&nbsp;
        Open Source on <a href="https://github.com/johnpolacek/team-health-checker">Github</a>.{" "}&nbsp;
        Follow me on <a href="https://johnpolacek.com/johnpolacek">Twitter</a>.
      </p>
    </footer>
	</> 
)
