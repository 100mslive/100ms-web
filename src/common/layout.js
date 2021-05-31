export const Layouts = {
  DEFAULT: "Default",
  GRIDVIEW: "GridView",
};
class View {
  constructor(name, roles, showPresenterInSmallTile) {
    this.name = name;
    this.roles = new Set(roles);
    this.showPresenterInSmallTile = showPresenterInSmallTile;
  }
}
class DefaultView extends View {
  constructor(roles, showPresenterInSmallTile) {
    super(Layouts.DEFAULT, roles, showPresenterInSmallTile);
  }
}
class GridView extends View {
  constructor(stageView, sideView, showPresenterInSmallTile) {
    super(
      Layouts.GRIDVIEW,
      [...sideView, ...stageView],
      showPresenterInSmallTile
    );
    this.stageView = new Set(stageView);
    this.sideView = new Set(sideView);
  }
}

export const App = {
  Teacher: new GridView(
    ["Student"],
    ["Teacher"],
    (peers, localPeer, presentingPeer) => {
      return localPeer.role === "Teacher" && presentingPeer.role === "Teacher";
    }
  ),
  Student: new GridView(
    ["Teacher"],
    ["Student"],
    (peers, localPeer, presentingPeer) => {
      return false;
    }
  ),
  Admin: new DefaultView(
    ["Student", "Teacher", "Admin"],
    (peers, localPeer, presentingPeer) => {
      return false;
    }
  ),
};
