/**
 * explain:容器内随机撒点
 * author:huangfuchunfeng
 * Time:2018/01/19 15:23
 * 父容器 定位类型需要是:absolute|fixed|relative 其中一种
 * 子容器 定位类型需要是:absolute
 * 原点是父容器中心点
 */
(function (window) {
    /**
     * @param {object} options 
     * options.ParentID 父容器id
     * radius_Parent 父容器半径
     * radius_children 子容器最大半径
     * class_children 子容器类名
     * tagName_children 子容器标签名 
     * row_Max 子容器在父容器中 排列最大圈数
     * origin_y 原点坐标y
     * origin_x 原点坐标x
     */
    function ScatteredPoints(options) {
        this.Ele_Parent = document.getElementById(options.ParentID)
        this.radius_Parent = Math.floor(this.Ele_Parent.offsetWidth / 2);
        this.radius_children = Math.floor(options.radius_children);
        this.className_children = options.className_children || "";
        this.tagName_children = options.tagName_children || "span";
        this.row_Max = Math.floor(this.radius_Parent / (this.radius_children * 2));
        this.origin_x = this.radius_Parent;
        this.origin_y = this.radius_Parent;
    }
    ScatteredPoints.prototype = {
        /**
         * 初始化
         */
        init: function () {
            this.createChildrenRow();
        },
        /**
         * 创建围绕原点的子容器坐标
         */
        createChildrenRow: function () {
            for (var i = 0; i < this.row_Max; i++) {
                this.createChildren(i);
            }
        },
        /**
         * 创建子容器
         */
        createChildren: function (index) {
            var base = [];
            for (var i = 0; i < 360; i += Math.ceil(360 / (180 / Math.ceil(Math.asin((this.radius_children * 2) / (2 * ((this.radius_Parent - this.radius_children * (2 * index)) - this.radius_children))) /
                    (Math.PI / 180)))) + index * 0.1) {
                var x = Math.floor(Math.cos(Math.PI / 180 * i) * ((this.radius_Parent - this.radius_children * (2 * index)) - this.radius_children));
                var y = Math.floor(Math.sin(Math.PI / 180 * i) * ((this.radius_Parent - this.radius_children * (2 * index)) - this.radius_children));
                if (this.rowPoints(base, {
                        x: x,
                        y: y
                    })) {
                    base.push({
                        x: x,
                        y: y
                    });
                    this.createChildrenEle(x, y);
                }
            }
        },
        /**
         * 子容器在父容器内坐标
         * @param {int} x 坐标x
         * @param {int} y 坐标y
         */
        createChildrenEle: function (x, y) {
            var children = document.createElement(this.tagName_children);
            children.setAttribute("class", this.className_children);
            children.style.width = this.radius_children * 2 + "px";
            children.style.height = this.radius_children * 2 + "px";
            children.style.top = (y + this.origin_x - this.radius_children) + "px";
            children.style.left = (x + this.origin_x - this.radius_children) + "px";
            this.Ele_Parent.appendChild(children);
        },
        /**
         * 当前圈所有点
         * 
         */
        rowPoints: function (base, point) {
            if (base.length > 0) {
                for (var i = 0; i < base.length; i++) {
                    if (this.distancePoint(base[i], point)) {
                        return false;
                    }
                }
                return true;
            } else {
                return true;
            }
        },
        /**
         * 计算两点间距离
         */
        distancePoint: function (ponit1, ponit2) {
            var diffX = Math.abs(ponit1.x - ponit2.x);
            var diffY = Math.abs(ponit1.y - ponit2.y);
            var c = Math.sqrt(diffX * diffX + diffY * diffY);
            if ((c - this.radius_children * 1.5) < 0) {
                return true;
            }
            return false;
        }
    }
    window.scatteredPoints = ScatteredPoints;
})(window);