var userInfo=db.userInfo.findOne();

for(var c=0;c<6;c++){
    var coll='graph4-'+c;
    var nodes=db[coll].findOne().nodes;
    var edges=db[coll].findOne().edges;
    for(var i=0;i<nodes.length;i++){
        var user=nodes[i];
        user.username=userInfo[user.id].username;
        delete user.attributes;
        delete user.label;
    }
    for(var j=0;j<edges.length;j++){
        delete edges[j].attributes;
    }
    db[coll].drop();
    db[coll].insert({
        edges:edges,
        nodes:nodes,
    });
}
