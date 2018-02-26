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
     * origin_y 原点坐标y
     * origin_x 原点坐标x
     * rows_children 子容器总圈数
     * nums_children  子容器总数
     */
    function ScatteredPoints(options) {
        this.Ele_Parent = document.getElementById(options.ParentID)
        this.radius_Parent = Math.floor(this.Ele_Parent.offsetWidth / 2);
        this.radius_children = Math.floor(options.radius_children);
        this.className_children = options.className_children || "";
        this.tagName_children = options.tagName_children || "span";
        this.rows_children = Math.floor(this.radius_Parent / (this.radius_children * 2));
        this.origin_x = this.radius_Parent;
        this.origin_y = this.radius_Parent;
        this.nums_children = 0;
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
            for (var i = 0; i < this.rows_children; i++) {
                this.createChildren(i);
            }
        },
        /**
         * 创建子容器
         */
        createChildren: function (index) {
            var base = [];
            var r = this.radius_Parent - this.radius_children * (2 * index + 1); //半径
            var c = this.radius_children * 2; //边长
            var n = this.calcN(r, c); //当前半径下总边数
            for (var i = 0; i < 360; i += n) {
                var x = Math.floor(Math.cos(Math.PI / 180 * i) * r);
                var y = Math.floor(Math.sin(Math.PI / 180 * i) * r);
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
            this.nums_children++;
        },
        /**
         * 当前圈所有点,计算是否重叠，防止360除不尽多一个子容器
         * 
         */
        rowPoints: function (base, point) {
            if (base.length > 0) {
                for (var i = 0; i < base.length; i++) {
                    if (this.calcP(base[i], point)) {
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
        calcP: function (ponit1, ponit2) {
            var diffX = Math.abs(ponit1.x - ponit2.x);
            var diffY = Math.abs(ponit1.y - ponit2.y);
            var c = Math.sqrt(diffX * diffX + diffY * diffY);
            if ((c - this.radius_children * 1.5) < 0) {
                return true;
            }
            return false;
        },
        /**
         * 已知正多边形边长和半径计算边数
         * @param {int} r 半径
         * @param {int} c 边长
         */
        calcN: function (r, c) {
            //弧度 = π/180×角度
            //角度 = 180/π×弧度
            var hd = Math.asin(c / 2 / r); //弧度
            var jd = hd * 180 / Math.PI; //角度
            var bn = Math.floor(180 / jd); //总边数
            var ad = 360 / bn; //360度循环递增数
            return ad;
        },
    }
    window.$scatteredPoints = ScatteredPoints;
})(window);