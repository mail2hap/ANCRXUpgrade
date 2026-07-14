window.ANCRX_DATA={
  version:'0.1.0',
  leadership:[
    {id:'direction',name:'Direction',prompt:'Are current priorities clear enough to guide tradeoffs today?'},
    {id:'financial',name:'Financial Strength',prompt:'Do leaders have enough current financial visibility to make decisions before pressure becomes crisis?'},
    {id:'risk',name:'Risk Controls',prompt:'Are material risks assigned, monitored, and supported by practical controls?'},
    {id:'human',name:'Human Intelligence',prompt:'Are decisions about people based on evidence, context, dialogue, and fair interpretation rather than assumptions?'}
  ],
  operations:[
    {id:'governance',name:'Governance',prompt:'Are board authority, executive authority, oversight, and decision rights functioning at the correct level?'},
    {id:'workplace',name:'Workplace Dynamics',prompt:'Are communication, collaboration, disagreement, and follow-through working under current pressure?'},
    {id:'capacity',name:'Carrying Capacity',prompt:'Can current people, time, resources, and systems reliably support current commitments?'},
    {id:'continuity',name:'Operational Continuity',prompt:'Can essential work continue when a key person, process, or access point is unavailable?'},
    {id:'relationships',name:'Strategic Relationships',prompt:'Are key donor, partner, community, and champion relationships actively supporting organizational goals?'}
  ],
  daily:[
    {id:'new_work',label:'New work was added without another commitment being reduced or delayed.',affects:['direction','capacity']},
    {id:'staff_gap',label:'A staff absence, vacancy, or coverage gap is affecting essential work.',affects:['capacity','continuity']},
    {id:'deadline_risk',label:'A significant deadline is at risk.',affects:['capacity','workplace']},
    {id:'cash_change',label:'Cash, revenue, or funding conditions changed materially.',affects:['financial','governance']},
    {id:'blocked_decision',label:'Work is blocked because a leadership or board decision has not been made.',affects:['direction','governance']},
    {id:'people_context',label:'A behavior or performance concern may be missing relevant context.',affects:['human','workplace']},
    {id:'new_risk',label:'A new operational, financial, compliance, safety, or reputation risk appeared.',affects:['risk','governance']},
    {id:'relationship_change',label:'A key external relationship needs attention.',affects:['relationships']}
  ],
  insights:{
    direction:'A priority becomes real only when leadership decides what will receive less time, money, or attention.',
    financial:'A budget records intention. Current cash visibility shows when leadership must make a decision.',
    risk:'A control is useful only when ownership, activation, and response are clear.',
    human:'Context is not automatically an excuse. It is information leadership must evaluate before deciding what accountability, support, correction, or system change is appropriate.',
    governance:'Boards govern priorities, policy, acceptable risk, and executive accountability. The executive director determines how those decisions are carried out.',
    workplace:'Resistance, delay, or tone should not be interpreted before expectations, workload, communication differences, and relevant context are tested.',
    capacity:'New work without a corresponding tradeoff becomes an additional demand, not a leadership decision.',
    continuity:'If critical work depends on one person, continuity is already exposed.',
    relationships:'Relationships become organizational assets when purpose, ownership, and follow-through are visible.'
  }
};
