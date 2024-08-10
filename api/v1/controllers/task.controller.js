const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

//[GET]/api/v1/tasks
module.exports.index = async (req, res) => {

    const find = {
        deleted: false
    };

    if(req.query.status){
        find.status = req.query.status;
    }
    //Tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
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

//[GET]/api/v1/tasks/detail/:id
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

//[PATCH]/api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {

    try {
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({
            _id: id
        },{
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
    
};

//[PATCH]/api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: {$in: ids}
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;
            case "delete":
                await Task.updateMany({
                    _id: {$in: ids}
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                });
                break;
            default:
                break;
        }
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
   
    
};

//[POST]/api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id; // lấy ra id người đã tạo
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            massage: "Tạo thành công!",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            massage: "Lỗi!"
        });
    }
};

//[PATCH]/api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({_id: id}, req.body);

        res.json({
            code: 200,
            massage: "Cập nhật thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            massage: "Lỗi!"
        });
    }
};

//[DELETE]/api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });

        res.json({
            code: 200,
            massage: "Xóa thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            massage: "Lỗi!"
        });
    }
};