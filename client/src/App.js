import React, {Component} from 'react';
import axios from 'axios';
import * as d3 from "d3"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            intervalIsSet: false,
        }
    }

    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 20000);
            this.setState({intervalIsSet: interval});
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet: null});
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        let line = d3.selectAll("#line")
        var totalLengh = line.node().getTotalLength();
        line.attr("stroke-dasharray",totalLengh)
            .attr("stroke-dashoffset",totalLengh)
            .attr("stroke-width",6)
            .attr("stroke","#6788ad")
    }

    getDataFromDb = () => {
        axios.get('http://localhost:1337/api')
            .then((res) => {
                this.setState({
                    data: res.data.stocks.map((dat)=>{return {x: new Date(dat.timestamp).getTime(), y: dat.stocks}}),
                })
            });
    };

    render() {

        const {data} = this.state;
        console.log(data)
        const minX = d3.min(data.map(o=>o.x))
        const maxX = d3.max(data.map(o=>o.x))
        const minY = d3.min(data.map(o=>o.y))
        const maxY = d3.max(data.map(o=>o.y))
        let x = d3.scaleLinear().domain([minX,maxX])
        let y = d3.scaleLinear().domain([minY,maxY])
        let line = d3.line().x((d)=>{return x(d.x)}).y((d)=>{return y(d.y)})
        let area = d3.area().x((d)=>{return x(d.x)}).y0((d)=>{return maxY}).y1((d)=> {return y(d.close)})

        return (<div>
            <svg>
                    <g>
                        <path id={"line"}
                        d={line(data)}
                              fill={"transparent"}
                              stroke={"transparent"}
                        />
                        <path id={"area"}
                              area={area(data)}
                                fill={"url(#MyGradient)"}
                              style={{opacity:0.8}}

                        />
                    </g>
                    </svg>
            hello
        </div>)
    }

}

export default App;
