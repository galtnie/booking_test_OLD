import React, { Component } from 'react';

export default class DateInput extends Component {    
  state = {
        dateInput: ''
    }
  
    dateLimit() {
        let date1 = new Date();
        let minLimit = (date1.getDate())
        date1.setDate(minLimit)
        return (date1.toISOString().split("T")[0])
      }

    render() {
        return (
            <div className="ui input" style={{ paddingRight: '1em', display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <input type='date' min={this.dateLimit()} value={this.props.dateInput} onChange={(e)=> this.props.controlDateInput(e.target.value)} style={{ padding: 0, lineHeight: '1em', background: '#FBFBFF' }} />
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "0.5em" }} >
                <i className={"search icon "} style={{color: '#FBFBFF', cursor: 'pointer',}} 
                    onClick={() => {
                    this.props.handleDateInput()
                 }
                }></i>
              </div>
            </div>
        );
    }
}