import javascript
import semmle.javascript.PackageExports as Exports
import DataFlow::PathGraph

class MyBackdoorConfig extends TaintTracking::Configuration {
  MyBackdoorConfig() { this = "MyBackdoorConfig" }

  override predicate isSource(DataFlow::Node source) {
    source = Exports::getALibraryInputParameter()
  }

  override predicate isSink(DataFlow::Node sink) { sink = any(ClientRequest cl).getADataNode() }
}

from MyBackdoorConfig conf, DataFlow::PathNode source, DataFlow::PathNode sink
where conf.hasFlowPath(source, sink)
select sink, source, sink, "API input flows to outward $@.", sink.getNode(), "network request"