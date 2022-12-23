/**
 * Graph component of site, including graph itself. 
 */
import React, { Component } from 'react'

import GraphComponent from './Graph';
import githubIcon from '../images/githubicon.png';

export class GraphOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snapMode: true,
            snapModeDelayed: false,
            shortcutMode: false,
            graphFocused: false,
            downloading: false,
        }
    }

    componentDidMount() {
        // Snap feature for graph
        document.onkeydown = (e) => {
            if (e.key === "Shift") {
                this.setState({shortcutMode: true})
            }

            // toggling snap mode with delay
            if (this.state.graphFocused && this.state.shortcutMode) {
                if (e.key === "G") {
                    this.toggleGrid();
                }
            }
        }

        // turning off shortcut mode 
        document.onkeyup = (e) => {
            if (e.key === "Shift") {
                this.setState({shortcutMode: false})
            }
        }

        // detecting if graph is focused
        document.onmousemove = (e) => {
            if (e.target.nodeName === "CANVAS") {
                this.setState({graphFocused: true})
            } else {
                this.setState({graphFocused: false})
            }
        }
    }

    /**
     * Toggle gridlines.
     */
    toggleGrid = () => {
        if (!this.state.snapModeDelayed) {
            this.setState(prevState => {return {snapMode: !prevState.snapMode, snapModeDelayed: true}})
            setTimeout(() => this.setState({snapModeDelayed: false}), 100)
        }
    }

    /**
     * Start download of graph as PNG / SVG. 
     * @param {*} fileType file type of graphic to download
     */
    startDownload = (fileType) => {
        this.setState({downloading: fileType});
        setTimeout(() => this.setState({downloading: false}), 500);
    }

    render() {
        return (
            <div id="graph-cover">
                <div className="graph-tl">
                    <h1 className="noselect">Graph View </h1>
                </div>
                <div className="graph-buttons">
                    <button className="btn btn-primary toggle-grid" onClick={this.toggleGrid}>Toggle Grid</button>
                    <button className="btn btn-primary auto-draw" onClick={this.props.autoDraw}>Auto-Draw</button>
                    <div className="dropdown">
                        <button className="btn btn-success download-graph" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-download"></i>
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => this.startDownload('SVG')}>SVG</button></li>
                            <li><button className="dropdown-item" onClick={() => this.startDownload('PNG')}>PNG</button></li>
                        </ul>
                    </div>
                    <button type="button"
                    id="deleteGraphBtn"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#siteModal"
                    onClick={this.props.deleteGraphPrompt}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
                <a className="github-button" href="https://github.com/daniel-ji/GEMF-Designer" target="_blank" rel="noreferrer" aria-label="github repo link">
                    <button className="btn btn-outline-dark p-0" aria-label="github repo button"><img src={githubIcon} alt="" /></button>
                </a>
                <GraphComponent 
                forceCollideRadius={this.props.forceCollideRadius}
                data={this.props.data}
                downloading={this.state.downloading}
                snapMode={this.state.snapMode}
                shortcutLink={this.props.shortcutLink}
                /> 
            </div>
        )
    }
}

export default GraphOverlay