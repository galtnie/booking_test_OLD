import React, { Component } from 'react';




export default class DateInput extends Component {
     
  state = {
        dateInput: ''

    }

  
    dateLimit() {
        let date1 = new Date();
        //let date2 = new Date();
        let minLimit = (date1.getDate())
        date1.setDate(minLimit)
        //let maxLimit = (date2.getDate() + 62)
        //date2.setDate(maxLimit)
        return (date1.toISOString().split("T")[0])
          //maxDate: (date2.toISOString().split("T")[0])
        
      }
      
      // onDateInput(value) {
      //   if (value < this.dateLimit().minDate ) {
      //     alert('The searched date cannot be erenow ')
      //   } else {

          
      //     this.props.handleDateInput(value)
      //     // let id = "date:" + value.slice(-2) + value.slice(5, 7) + value.slice(2, 4)
      //     // let distance = document.getElementById(id).offsetTop
      //     // window.scrollBy(0, distance)
      //   }
      // }
    

    render() {
 
        return (
            <div className="ui input" style={{ paddingRight: '1em' }}>
              <input type='date' min={this.dateLimit()} value={this.props.dateInput} onChange={(e)=> this.props.controlDateInput(e.target.value)} style={{ padding: 0, lineHeight: '1em', background: '#FBFBFF' }} />
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "0.5em" }} >
                <i className={"search icon "} style={{color: '#FBFBFF',
                                                      cursor: 'pointer',}} 
                    onClick={() => {
                    //this.onDateInput(this.state.dateInput)
                    this.props.handleDateInput()
                 }
                }></i>
              </div>
            </div>
        );
    }
}