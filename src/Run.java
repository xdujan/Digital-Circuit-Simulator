/open src/CombinedClasses.java

//IOElement elementsInstance = new IOElement(true);


 Annotation a1 = new Annotation("Gute",50,400);
Annotation a2 = new Annotation("Dings",35,94);
Annotation a3 = new Annotation("Passiert",85,456); 

try {
    LiveView liveView = new LiveView();
    liveView.start();
} catch (IOException e) {
    e.printStackTrace();
} 