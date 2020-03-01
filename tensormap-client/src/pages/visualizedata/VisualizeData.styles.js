const styles = theme => ({
	container: {
	    position: 'absolute',
	    left: '20%',
	    top: '20%'
  	},
  	highlightRow: {
  		backgroundColor: 'red'
  	},
  	highlightCol: {
  		backgroundColor: 'green'
  	},
  	table: {
		fontFamily: '"Trebuchet MS", Arial, Helvetica, sans-serif',
  		borderCollapse: 'collapse',
  		width: '100%',
  	},
  	tabletd: {
		border: '1px solid #ddd',
		padding: '8px',
  	},
  	tableth: {
		border: '1px solid #ddd',
		padding: '8px',
		paddingTop: '12px',
  		paddingBottom: '12px',
  		textAlign: 'left',
  		backgroundColor: '#4CAF50',
  		color: 'white',
  	},
  	viewbtn: {
		backgroundColor: '#008CBA',
		border: 'none',
		color: 'white',
		padding: '5px 10px',
		textDecoration: 'none',
		display: 'inline-block',
		fontSize: '15px',
		margin: '4px 2px',
		cursor: 'pointer',
		borderRadius: '5px',
		width: '100px',
		textAlign: 'center'
  	},
  	inputdata: {
  		display: 'inline-block',
  		width: '50px'
	  },

	visualizeHeader: {
		padding: '5px',
		// textAlign: 'center',
		background: 'white',
		color: 'black',
		fontSize: '15px'
	  },

	tabStyle:{
		padding: '30px'
	}


})

export default styles
