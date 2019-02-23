import React from 'react'
import {Button as Btn} from 'styled-system-html'

export default (props) => (
	<Btn
	    fontSize={4}
	    m={0}
	    py={3}
	    px={4}
	    color='white'
	    bg='blue'
	    border={0}
	    borderRadius="8px"
		{...props}
	/>
)