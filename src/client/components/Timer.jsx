import React from 'react'

export default class Timer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      start: props.start,
      end: props.end
    }
    this._timerInterval = null
  }

  componentDidMount () {
    this.checkTimer()
  }

  componentDidUpdate () {
    this.checkTimer()
  }

  componentWillUnmount () {
    clearInterval(this._timerInterval)
    this._timerInterval = null
  }

  checkTimer () {
    if (this.running && !this._timerInterval) {
      this._timerInterval = setInterval(this.setCurrentTime.bind(this), 30)
    } else if (!this.running) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.start !== state.start || props.end !== state.end) {
      return {
        start: props.start,
        end: props.end
      }
    }
    return null
  }

  get running () {
    // console.log('*** running?', this.state.start, this.state.end)
    return !!this.state.start && !this.state.end
  }

  get currentTime () {
    return parseInt((
      this.state.start
        ? this.state.end
          ? this.state.end.valueOf() - this.state.start.valueOf()
          : new Date().valueOf() - this.state.start.valueOf()
        : 0
    ) / 10) / 100
  }

  setCurrentTime = () => {
    this.setState({
      _: Math.random()
    })
  }

  render () {
    // console.log('**** render', this.running, this.state)
    return this.currentTime
  }
}