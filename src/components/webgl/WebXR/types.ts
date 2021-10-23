export interface XRProfile {
  profileId: string;
  fallbackProfileIds?: string[] | null;
  layouts: Layouts;
}
export interface Layouts {
  left: Left;
  right: Right;
}
export interface Left {
  selectComponentId: string;
  components: LeftController;
  gamepadMapping: string;
  rootNodeName: string;
  assetPath: string;
}
export interface LeftController {
  'xr-standard-trigger': XRStandardTrigger;
  'xr-standard-squeeze': XRStandardSqueeze;
  'xr-standard-thumbstick': XRStandardThumbstick;
  'x-button': XButton;
  'y-button': YButton;
  thumbrest: Thumbrest;
}
export interface XRStandardTrigger {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses;
}
export interface GamepadIndices {
  button: number;
}
export interface VisualResponses {
  xr_standard_trigger_pressed: XRStandard;
}
export interface XRStandard {
  componentProperty: string;
  states?: string[] | null;
  valueNodeProperty: string;
  valueNodeName: string;
  minNodeName: string;
  maxNodeName: string;
}
export interface XRStandardSqueeze {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses1;
}
export interface VisualResponses1 {
  xr_standard_squeeze_pressed: XRStandard;
}
export interface XRStandardThumbstick {
  type: string;
  gamepadIndices: GamepadIndices1;
  rootNodeName: string;
  visualResponses: VisualResponses2;
}
export interface GamepadIndices1 {
  button: number;
  xAxis: number;
  yAxis: number;
}
export interface VisualResponses2 {
  xr_standard_thumbstick_pressed: XRStandard;
  xr_standard_thumbstick_xaxis_pressed: XRStandard;
  xr_standard_thumbstick_yaxis_pressed: XRStandard;
}
export interface XButton {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses3;
}
export interface VisualResponses3 {
  x_button_pressed: XRStandard;
}
export interface YButton {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses4;
}
export interface VisualResponses4 {
  y_button_pressed: XRStandard;
}
export interface Thumbrest {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses5;
}
export interface VisualResponses5 {
  thumbrest_pressed: XRStandard;
}
export interface Right {
  selectComponentId: string;
  components: RightController;
  gamepadMapping: string;
  rootNodeName: string;
  assetPath: string;
}
export interface RightController {
  'xr-standard-trigger': XRStandardTrigger;
  'xr-standard-squeeze': XRStandardSqueeze;
  'xr-standard-thumbstick': XRStandardThumbstick;
  'a-button': AButton;
  'b-button': BButton;
  thumbrest: Thumbrest;
}
export interface AButton {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses6;
}
export interface VisualResponses6 {
  a_button_pressed: XRStandard;
}
export interface BButton {
  type: string;
  gamepadIndices: GamepadIndices;
  rootNodeName: string;
  visualResponses: VisualResponses7;
}
export interface VisualResponses7 {
  b_button_pressed: XRStandard;
}

export type ButtonStateProps = keyof LeftController | RightController;

type ButtonStateValues =
  | {
      button: 0;
      xAxis: 0;
      yAxis: 0;
    }
  | 0;

export type ButtonStates = {
  [K in keyof ButtonStateProps]: ButtonStateValues;
};

export interface Profile {
  name?: string;
  targetRayMode?: string;
  layouts?: string;
  left?: LeftController;
  right?: RightController;
}
