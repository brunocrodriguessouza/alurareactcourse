import React, { Component } from 'react';

export default class ComboBoxCustomizado extends Component {

    render() {
        return (
            <div className="pure-control-group">
                <label></label>
                <select value={this.props.label}>
                    <option value="">Selecione</option>
                </select>
            </div>
        );
    }
}
