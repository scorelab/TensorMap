const styles = theme => ({
	main_container:{
		marginTop:20,
	},
	container: {
		padding:40,
    display: 'flex',
    flexWrap: 'wrap',
  },
	formControl: {
    margin: theme.spacing.unit,
    minWidth: "calc(100% - 16px)",
		textAlign:"center",
  },
	buttonControl:{
		margin: theme.spacing.unit,
    minWidth: "calc(100% - 16px)",
		textAlign:"center",
		marginTop:20
	},
  	text: {
		width: '100%',
		padding: '12px 20px',
		margin: '8px 0',
		display: 'inline-block',
		border: '1px solid #ccc',
		borderRadius: '4px',
		boxSizing: 'border-box'
  	},
  	submit: {
		width: '100%',
		color: 'white',
		backgroundColor: 'green',
		padding: '14px 20px',
		margin: '8px 0',
		border: 'none',
		cursor: 'pointer',
  	},
  	browse: {
		width: '100%',
		padding: '14px 20px',
		margin: '8px 0',
		border: 'none',
		cursor: 'pointer',
  	}

})

export default styles
