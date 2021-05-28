export const Layouts = {
  DEFAULT: "Default",
  GRIDVIEW: "GridView",
};
class View {
  constructor(name, roles) {
    this.name = name;
    this.roles = new Set(roles);
  }
}
class DefaultView extends View {
  constructor(roles) {
    super(Layouts.DEFAULT, roles);
  }
}
class GridView extends View {
  constructor(stageView, sideView) {
    super(Layouts.GRIDVIEW, [...sideView, ...stageView]);
    this.stageView = new Set(stageView);
    this.sideView = new Set(sideView);
  }
}

export const App = {
  Teacher: new GridView(["Student"], ["Teacher"]),
  Student: new GridView(["Teacher"], ["Student"]),
  Admin: new DefaultView(["Student", "Teacher", "Admin"]),
};
