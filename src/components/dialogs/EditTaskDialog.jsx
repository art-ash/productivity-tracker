import React, { Component } from "react";
import { connect } from "react-redux";
// import firebase from "firebase";
import { getDatabase, ref, onValue, set} from "firebase/database";
import EstimationControl from "./EstimationControl";
import { hideModal } from "../../actions/modalActions";
import { categoryConfig, priorityConfig } from '../../config/dialogsConfig';

class EditTaskDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: "",
        description: "",
        category: "",
        deadline: "",
        estimation: 0,
        priority: 0,
        isDone: false,
        isGlobal: true,
      },
    };

    this.handleEditTask = this.handleEditTask.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleEstimationChange = this.handleEstimationChange.bind(this);

    this.db = getDatabase();
  }

  componentDidMount() {
    const { tasks } = this.props;
    const { id } = this.props.dialog;
    let { form } = this.state;

    for (let i in tasks) {
      if (i === id) form = tasks[i];
    }

    this.setState({ form });
  }

  handleEditTask(e) {
    const { form } = this.state;
    const { id } = this.props.dialog;
    const dbRef = ref(this.db, `tasks/${id}`);
    set(dbRef, form);
    onValue(dbRef, () => {}, (err) => console.error(err));

    this.props.hideModal();
    e.preventDefault();
  }

  handleTextChange(e) {
    const { target } = e;
    const { form } = this.state;
    form[target.name] = target.value;
    this.setState({ form });
  }

  handleRadioChange(e) {
    const { target } = e;
    const { form } = this.state;
    form[target.name] = target.id;
    this.setState({ form });
  }

  handleEstimationChange(e) {
    const { form } = this.state;
    form.estimation = e.target.value;
    this.setState({ form });
  }

  render() {
    const { title, description, category, deadline, estimation, priority } = this.state.form;

    return (
      <section className="dialog">
        <form onSubmit={this.handleEditTask}>
          <h1 className="dialog__heading">Edit Task</h1>
          <ul className="dialog__list">
            <li className="dialog__list-item">
              <h2 className="dialog__list-item-title">Title</h2>
              <input
                id="add-task-title"
                className="dialog__text-input"
                type="text"
                name="title"
                placeholder="Add title here"
                value={title}
                onChange={this.handleTextChange}
                required="required"
              />
            </li>
            <li className="dialog__list-item">
              <h2 className="dialog__list-item-title">Description</h2>
              <input
                id="add-task-description"
                className="dialog__text-input"
                type="text"
                name="description"
                placeholder="Add description here"
                value={description}
                onChange={this.handleTextChange}
                required="required"
              />
            </li>
            <li className="dialog__list-item">
              <h2 className="dialog__list-item-title">Category</h2>
              {categoryConfig.map((item) => {
                const id = item.toLowerCase();
                const checked = { checked: false };
                if (id === category) checked.checked = true;

                return (
                  <span key={`key-${id}`}>
                    <input
                      className={`dialog__radio-input dialog__radio-input--${id}`}
                      type="radio"
                      name="category"
                      id={id}
                      value={id}
                      {...checked}
                      onChange={this.handleRadioChange}
                    />
                    <label htmlFor={id} className="dialog__radio-label">
                      {item}
                    </label>
                  </span>
                );
              })}
            </li>
            <li className="dialog__list-item">
              <h2 className="dialog__list-item-title">Deadline</h2>
              <input
                id="add-task-deadline"
                className="dialog__text-input"
                type="date"
                value={deadline}
                name="deadline"
                onChange={this.handleTextChange}
                required="required"
              />
            </li>
            <li className="dialog__list-item">
              <h2 className="dialog__list-item-title">Estimation</h2>
              <EstimationControl
                estimation={estimation}
                handleEstimationChange={this.handleEstimationChange}
              />
            </li>
            <li className="dialog__list-item">
              <h2 className="dialog__list-item-title">Priority</h2>
              {priorityConfig.map((item) => {
                const id = item.toLowerCase();
                const checked = { checked: false };
                if (id === priority) checked.checked = true;

                return (
                  <span key={`key-${id}`}>
                    <input
                      className={`dialog__radio-input dialog__radio-input--${id}`}
                      type="radio"
                      name="priority"
                      id={id}
                      value={id}
                      {...checked}
                      onChange={this.handleRadioChange}
                    />
                    <label htmlFor={id} className="dialog__radio-label">
                      {item}
                    </label>
                  </span>
                );
              })}
            </li>
          </ul>
          <div className="dialog__controls">
            <button
              type="button"
              title="Close"
              className="icon-close dialog__close dialog__btn close-dialog"
              onClick={() => this.props.hideModal()}
            />
            <button
              type="submit"
              title="Edit Task"
              className="icon-check dialog__check dialog__btn done-dialog"
            />
          </div>
        </form>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  tasks: state.tasks.items,
  dialog: state.modals.dialog,
});

export default connect(mapStateToProps, { hideModal })(EditTaskDialog);
