import {expect,test} from 'bun:test'
import {busProps} from '../lib/components/bus'
import {autorouterProp} from '../lib/components/group'
test('bus_lanes preset and unit-aware impedance profile parse',()=>{
 expect(autorouterProp.parse('bus_lanes')).toBe('bus_lanes')
 const bus=busProps.parse({connections:['DATA0'],targetImpedance:'50ohm',pcbImpedanceProfile:{layer:'top',points:[{traceWidth:'0.1mm',impedance:'60ohm'},{traceWidth:'0.2mm',impedance:'40ohm'}]}})
 expect(bus.pcbImpedanceProfile?.points).toEqual([{traceWidth:0.1,impedance:60},{traceWidth:0.2,impedance:40}])
 expect(()=>busProps.parse({connections:['DATA0'],pcbImpedanceProfile:{layer:'top',points:[{traceWidth:-1,impedance:50}]}})).toThrow()
})
