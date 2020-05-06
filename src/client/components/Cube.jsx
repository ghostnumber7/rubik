import React from 'react'
import { mapContextToProps } from 'Context'
import Timer from './Timer'

class CubeRender extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      startTime: null,
      endTime: null,
      moves: null,
      movesList: [],
      cubePositions: [],
      isSolved: null,
      state: null
    }
  }

  loadCube () {
    if (this.props.cube !== this.state.cube) {
      if (this.state.cube) {
        this.state.cube.off(this.state.cube.Events.MOVED, this.onMove)
      }
      if (this.props.cube) {
        const { cube } = this.props
        if (cube.loaded) {
          this.setState({
            cube,
            cubeLoaded: true,
            cubeState: cube.currentState,
            isSolved: cube.solved
          }, () => {
            cube.on(cube.Events.MOVED, this.onMove)
          })
        } else {
          cube.once(cube.Events.LOADED, () => {
            this.setState({
              cube,
              cubeLoaded: true,
              isSolved: cube.solved,
              cubeState: cube.currentState
            }, () => {
              cube.on(cube.Events.MOVED, this.onMove)
            })
          })
        }
      } else {
        this.setState({
          cube: undefined,
          cubeLoaded: false,
          cubeState: null,
          isSolved: false
        })
      }
    }
  }

  componentDidUpdate () {
    if (this.props.cube !== this.state.cube) {
      this.loadCube()
    }
  }

  onMove = move => {
    if (this.props.cubeState !== this.state.cubeState) {
      this.setState({
        cubeState: this.state.cube.currentState,
        isSolved: this.state.cube.solved,
        startTime: typeof this.state.moves === 'number' && !this.state.startTime ? new Date().valueOf() : this.state.startTime,
        endTime: typeof this.state.moves === 'number' && !this.state.endTime && this.state.cube.solved ? new Date().valueOf() : this.state.endTime,
        moves: typeof this.state.moves === 'number' && !this.state.endTime
          ? this.state.moves + 1
          : this.state.moves,
          movesList: typeof this.state.moves === 'number' && !this.state.endTime
          ? [...this.state.movesList, move.notation]
          : this.state.movesList
      })
    }
  }

  startSolve = () => {
    this.setState({
      moves: 0,
      startTime: null,
      endTime: null,
      movesList: []
    })
  }

  resetSolve = () => {
    this.setState({
      moves: null,
      startTime: null,
      endTime: null,
      movesList: []
    })
  }

  render () {
    if (!this.state.cubeLoaded) return null
    const [U, R, F, D, L, B] = this.state.cubeState.match(/.{9}/g)
    const empty = '         '
    const render = [
      empty, U, empty, empty,
      L, F, R, B,
      empty, D, empty, empty
    ].map(item => item.match(/.{3}/g).join('\n'))

    return (
      <React.Fragment>
        {
          render.map((item, n) => {
            return (
              <span style={{ float: 'left', clear: n % 4 ? null : 'both' }} key={n}>
                <pre style={{ margin: 0 }}>{item}</pre>
              </span>
            )
          })
        }
        <p style={{ clear: 'both' }}>Solved: {this.state.isSolved ? 'YES' : 'NO'}</p>
        {
          typeof this.state.moves === 'number'
            ? this.state.startTime
              ? <div>
                  <p>Start: {new Date(this.state.startTime).toISOString()}</p>
                  <p>End: {this.state.endTime ? new Date(this.state.endTime).toISOString() : '--'}</p>
                  <p>Time: <Timer start={this.state.startTime} end={this.state.endTime}/></p>
                  <p>Moves: {this.state.moves}</p>
                  {
                    <p>Move list: {this.state.movesList.join(' ')}</p>
                  }
                  {
                    this.state.endTime
                      ? <button onClick={this.resetSolve}>RESET</button>
                      : null
                  }
                </div>
              : <div>Move cube to start timer</div>
            : <button onClick={this.startSolve}>Start solving</button>
        }
      </React.Fragment>
    )
  }
}

const contextMapper = context => ({
  cube: context.cube
})

export default mapContextToProps(contextMapper)(CubeRender)
