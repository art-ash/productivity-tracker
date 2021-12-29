import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import firebase from "firebase";
import SettingsList from "./SettingsList";
import SettingsCycle from "./SettingsCycle";
import { fetchSettings } from "../actions/settingsActions";
import Preloader from "./Preloader";

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      changed: false,
      settings: {},
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.db = firebase.database();
    this.dbRef = this.db.ref("settings");
  }

  componentDidMount() {
    const { settings } = this.props;
    this.setState({ settings });

    this.props.fetchSettings();
  }

  handleSave() {
    const { settings } = this.state;
    
    if (Object.keys(settings).length) {
      this.dbRef.set(settings);
      this.dbRef.on(
        "value",
        (data) => {
          const payload = data.val();
          if (payload) {
            console.log("Settings saved", payload);
          }
        },
        (err) => {
          console.log("Error saving settings");
          console.error(err);
        }
      );

      this.setState({ redirect: "/" });
    }
  }

  handleChange(action, config) {
    const { max, min, step, pname } = config;
    const { changed } = this.state;
    const { settings } = changed ? this.state : this.props;

    !changed && this.setState({ changed: true });

    if (action === "plus" && settings[pname] < max) {
      settings[pname] = settings[pname] + step;
    }
    if (action === "minus" && settings[pname] > min) {
      settings[pname] = settings[pname] - step;
    }
    this.setState({ settings });
  }

  render() {
    const { redirect, changed } = this.state;
    const { settings } = this.props;

    if (redirect) return <Redirect to={redirect} />;

    return (
      <main className="main">
        <div className="content">
          <h1 className="heading">Settings</h1>
          <h2 className="subheading">Pomodoros settings</h2>
          {Object.keys(settings).length ? (
            <>
              <SettingsList
                settings={changed ? this.state.settings : settings}
                handleChange={this.handleChange}
              />
              <SettingsCycle settings={changed ? this.state.settings : settings} />
              <div className="buttons">
                <Link to="/" className="buttons__btn buttons__btn--blue">
                  Go to tasks
                </Link>
                <a className="buttons__btn buttons__btn--green" onClick={this.handleSave}>
                  Save
                </a>
              </div>
            </>
          ) : (
            <Preloader />
          )}
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settings.items,
});

export default connect(mapStateToProps, { fetchSettings })(SettingsPage);
