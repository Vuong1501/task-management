const Task = require("../models/task.model");

//[GET]/api/v1/tasks
module.exports.index = async (req, res) => {

    const find = {
        deleted: false
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    //sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue; // vì key và value truyền lên là linh động nên cần req.query.....
    }

    //end sort

    const tasks = await Task.find(find).sort(sort);

    res.json(tasks);
};

//[GET]/api/v1/tasks/etail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy");
    } 
};