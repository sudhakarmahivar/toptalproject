import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
const styles = {
  pageHeaderView: {},
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 30,
  },
};
/**
 * Display Page title and subtitle
 */
export class PageHeaderView extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    classes: PropTypes.object,
  };
  static defaultProps = {
    title: null,
    subtitle: null,
    classes: {},
  };
  render() {
    const { title, subtitle, classes } = this.props;
    return (
      <div className={classes.pageHeaderView}>
        {title && <div className={classes.title}>{title}</div>}
        {subtitle && <div className={classes.subtitle}>{subtitle}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(PageHeaderView);
