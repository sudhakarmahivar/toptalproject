import React from "react";
import { shallow } from "enzyme";
import sinon from "sinon";

import ConfirmationDialogView from "./ConfirmationDialogView";

describe("<ConfirmationDialogView />", () => {
  it("renders components", () => {
    const wrapper = shallow(<ConfirmationDialogView />);
    expect(wrapper.find(".confirmationDialogView")).not.toBeNull();
  });
});
