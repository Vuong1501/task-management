const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");

//[GET]/api/v1/tasks
module.exports.index = async (req, res) => {

    const find = {
        deleted: false
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    // Phân trang
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    }
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );

    // End Phân trang

    //sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue; // vì key và value truyền lên là linh động nên cần req.query.....
    }

    //end sort

    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems) // giới hạn bản ghi từng trang
    .skip(objectPagination.skip);//bỏ qua bao nhiêu bản ghi

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