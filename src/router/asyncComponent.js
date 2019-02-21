import React from "react";

export default function asyncComponent(importComponent) {
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                component: null
            };
        }

        async importComponent(){
          const { default: component } = await importComponent();
          this.setState({
            component: component
          }); 
        }
        
        componentDidMount() {
          this.lodingComponent=setTimeout(()=>{
            this.importComponent()
          },1) 
        }

        componentWillUnmount(){
          clearTimeout(this.lodingComponent)
        }
        
        render() {
            const Component = this.state.component;
            return Component ? <Component {...this.props} /> : null;
        }
    }
    return AsyncComponent;
}
