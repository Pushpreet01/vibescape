declare module 'react-native-bootstrap-styles' {
    // Define the shape of the BootstrapStyleSheet class
    class BootstrapStyleSheet {
      constructor(options?: any);
      s: { [key: string]: any }; // The styles object (e.g., s.container, s.p3)
    }
  
    // Export the default class
    export default BootstrapStyleSheet;
  }