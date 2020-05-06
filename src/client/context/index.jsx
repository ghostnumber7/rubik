import React from 'react'
import omit from 'lodash/omit'

const Context = React.createContext()

class Provider extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...omit(props, 'children'),
      set: this.set.bind(this)
    }
  }

  set (...args) {
    if (typeof args[0] === 'object') {
      this.setState(args[0])
    } else if (typeof args[0] === 'string') {
      this.setState({
        [args[0]]: args[1]
      })
    } else {
      throw new Error('Invalid options for set context')
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      ...state,
      ...props
    }
  }

  render () {
    return (
      <Context.Provider value={{...this.state}}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

const Consumer = Context.Consumer

const mapContextToProps = contextMapper => Class => {
  return class ContextMapper extends React.PureComponent {
    render () {
      return (
        <Consumer>{
          contextVariables => <Class {...contextMapper(contextVariables)} {...this.props} />
        }</Consumer>
      )
    }
  }
}

export default Context
export {
  Context, Consumer, Provider, mapContextToProps
}
