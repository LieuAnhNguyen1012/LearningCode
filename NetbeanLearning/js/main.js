/*
 * JavaWeb Lab — JavaScript thuần, mở được bằng file://.
 * 1. CODE: mã Java/JSP/SQL để đọc (không được thực thi).
 * 2. LESSONS + build...(): nội dung, tình huống và ảnh chụp dữ liệu từng bước.
 * 3. Giao diện: sơ đồ SVG, vùng code, điều khiển phát và biểu mẫu.
 * Dữ liệu minh họa chỉ nằm trong bộ nhớ; không gửi thông tin ra mạng.
 */
(() => {
  "use strict";
  const BASE_USERS = [
    {
      userID: "admin",
      password: "123456",
      fullName: "Nguyen Van Quan",
      roleID: "AD",
      status: true,
    },
    {
      userID: "user1",
      password: "123456",
      fullName: "Tran Thi Mai",
      roleID: "US",
      status: true,
    },
  ];
  const DEMO_USERS = [
    ...BASE_USERS,
    {
      userID: "locked",
      password: "123456",
      fullName: "Le Minh Khoa",
      roleID: "US",
      status: false,
    },
  ];
  const file = (name, text, kind = "Trích đoạn học tập") => ({
    name,
    text: text.trim(),
    kind,
  });
  const node = (id, label, sub) => ({ id, label, sub });
  const step = (
    title,
    description,
    at,
    fileName,
    focus,
    data = {},
    from = null,
    extra = {},
  ) => ({
    title,
    description,
    at,
    file: fileName,
    focus: Array.isArray(focus) ? focus : [focus],
    data,
    from,
    ...extra,
  });
  const field = (key, label, value, options = null, type = "text") => ({
    key,
    label,
    value,
    options,
    type,
  });
  const option = (value, label) => ({ value, label });
  const publicRows = (users) =>
    users.map((u) => [u.userID, u.fullName, u.roleID, u.status ? "1" : "0"]);
  const userTable = (
    users,
    caption = "tblUsers · dữ liệu minh họa",
    cursor = -1,
  ) => ({
    headers: ["userID", "fullName", "roleID", "status"],
    rows: publicRows(users),
    caption,
    cursor,
  });
  const javaString = (value) => JSON.stringify(String(value));
  const htmlAttribute = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const sources = {
    servlet: [
      "Servlet API · HttpServlet",
      "https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServlet.html",
    ],
    request: [
      "Servlet API · request và thuộc tính",
      "https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html",
    ],
    forward: [
      "Servlet API · forward",
      "https://docs.oracle.com/javaee/7/api/javax/servlet/RequestDispatcher.html",
    ],
    netbeans: [
      "Apache NetBeans 13 · JDK chạy IDE",
      "https://netbeans.apache.org/front/main/download/nb13/nb13/",
    ],
    tomcat: [
      "Apache Tomcat · chuyển từ javax sang jakarta",
      "https://tomcat.apache.org/migration-10.html",
    ],
    prepared: [
      "Oracle · PreparedStatement",
      "https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html",
    ],
    resources: [
      "Oracle · try-with-resources",
      "https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html",
    ],
    mvc: [
      "Oracle · kiến trúc Model 1 và Model 2",
      "https://download.oracle.com/otn_hosted_doc/jdeveloper/1012/developing_mvc_applications/adf_aboutmvc2.html",
    ],
  };
  function servletClass(name, body, constants = "", annotation = true) {
    return `package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import dao.UserDAO;
import dto.UserDTO;

${annotation ? `@WebServlet(name = "${name}", urlPatterns = {"/${name}"})` : ""}
public class ${name} extends HttpServlet {
${constants}
    protected void processRequest(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
${body
  .split("\n")
  .map((s) => "        " + s)
  .join("\n")}
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}`;
  }
  const CODE = {};
  CODE.hello = servletClass(
    "HelloServlet",
    `String name = request.getParameter("name");
request.setAttribute("MESSAGE", "Xin chao " + name);
request.getRequestDispatcher("hello.jsp")
       .forward(request, response);`,
  ).replace("import dao.UserDAO;\nimport dto.UserDTO;\n", "");
  CODE.helloJsp = `<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Hello</title></head>
<body>
    <h1>\${requestScope.MESSAGE}</h1>
    <a href="index.html">Quay lai</a>
</body>
</html>`;
  CODE.db = `package utils;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBUtils {
    public static Connection getConnection() throws Exception {
        String url = "jdbc:sqlserver://localhost:1433"
                   + ";databaseName=PRJ301Demo";
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        return DriverManager.getConnection(
            url, "sa", "MAT_KHAU_SQL_CUA_BAN");
    }
}`;
  CODE.sql = `CREATE DATABASE PRJ301Demo;
GO
USE PRJ301Demo;
GO
CREATE TABLE tblUsers (
    userID VARCHAR(20) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    fullName NVARCHAR(100) NOT NULL,
    roleID VARCHAR(10) NOT NULL,
    status BIT NOT NULL DEFAULT 1
);
GO
INSERT INTO tblUsers VALUES
 ('admin','123456',N'Nguyen Van Quan','AD',1),
 ('user1','123456',N'Tran Thi Mai','US',1);`;
  CODE.dto = `package dto;

public class UserDTO {
    private String userID;
    private String password;
    private String fullName;
    private String roleID;
    private boolean status;

    public UserDTO() { }
    public UserDTO(String userID, String password,
            String fullName, String roleID, boolean status) {
        this.userID = userID;
        this.password = password;
        this.fullName = fullName;
        this.roleID = roleID;
        this.status = status;
    }
    public String getUserID() { return userID; }
    public void setUserID(String userID) { this.userID = userID; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRoleID() { return roleID; }
    public void setRoleID(String roleID) { this.roleID = roleID; }
    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
}`;
  CODE.main = servletClass(
    "MainController",
    `String url = WELCOME;
try {
    String action = request.getParameter("action");
    if (action != null) {
        switch (action) {
            case "Login":  url = "LoginController";  break;
            case "Logout": url = "LogoutController"; break;
            case "Search": url = "SearchController"; break;
            case "Create": url = "CreateController"; break;
            case "Update": url = "UpdateController"; break;
            case "Delete": url = "DeleteController"; break;
            default:       url = WELCOME;
        }
    }
} catch (Exception e) {
    log("Error at MainController", e);
} finally {
    request.getRequestDispatcher(url).forward(request, response);
}`,
    `    private static final String WELCOME = "login.jsp";`,
    false,
  );
  CODE.webxml = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" version="4.0">
    <servlet>
        <servlet-name>MainController</servlet-name>
        <servlet-class>controller.MainController</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>MainController</servlet-name>
        <url-pattern>/MainController</url-pattern>
    </servlet-mapping>
    <welcome-file-list>
        <welcome-file>MainController</welcome-file>
    </welcome-file-list>
    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>
</web-app>`;
  CODE.daoLogin = `// Bên trong dao.UserDAO; cần import java.sql.*, dto.UserDTO, utils.DBUtils.
private static final String CHECK_LOGIN =
    "SELECT userID, fullName, roleID, status "
  + "FROM tblUsers WHERE userID = ? AND password = ?";

public UserDTO checkLogin(String userID, String password) throws Exception {
    UserDTO user = null;
    Connection cn = null;
    PreparedStatement st = null;
    ResultSet rs = null;
    try {
        cn = DBUtils.getConnection();
        st = cn.prepareStatement(CHECK_LOGIN);
        st.setString(1, userID);
        st.setString(2, password);
        rs = st.executeQuery();
        if (rs.next()) {
            user = new UserDTO(rs.getString("userID"), "",
                rs.getString("fullName"), rs.getString("roleID"),
                rs.getBoolean("status"));
        }
    } finally {
        // Lồng finally để vẫn đóng hết nếu một close() ném lỗi.
        try { if (rs != null) rs.close(); }
        finally {
            try { if (st != null) st.close(); }
            finally { if (cn != null) cn.close(); }
        }
    }
    return user;
}`;
  CODE.login = servletClass(
    "LoginController",
    `String url = ERROR;
try {
    String userID = request.getParameter("userID");
    String password = request.getParameter("password");
    if (userID == null || userID.trim().isEmpty()
            || password == null || password.isEmpty()) {
        request.setAttribute("ERROR", "Please enter user and password");
    } else {
        UserDAO dao = new UserDAO();
        UserDTO user = dao.checkLogin(userID.trim(), password);
        if (user == null) {
            request.setAttribute("ERROR", "Invalid user or password");
        } else if (!user.isStatus()) {
            request.setAttribute("ERROR", "This account is disabled");
        } else {
            request.getSession().setAttribute("LOGIN_USER", user);
            url = SUCCESS;
        }
    }
} catch (Exception e) {
    log("Error at LoginController", e);
    request.setAttribute("ERROR", "System error");
} finally {
    request.getRequestDispatcher(url).forward(request, response);
}`,
    `    private static final String ERROR = "login.jsp";
    private static final String SUCCESS = "welcome.jsp";`,
  );
  CODE.loginJsp = `<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Login</title></head>
<body>
    <h1>DANG NHAP HE THONG</h1>
    <form action="MainController" method="POST">
        <label>Tai khoan: <input name="userID" required></label>
        <label>Mat khau: <input type="password" name="password" required></label>
        <button type="submit" name="action" value="Login">Login</button>
    </form>
    <p style="color:red">\${requestScope.ERROR}</p>
</body>
</html>`;
  CODE.welcome = `<%@page import="dto.UserDTO"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    response.setHeader("Cache-Control", "no-store");
    UserDTO acc = (UserDTO) session.getAttribute("LOGIN_USER");
    if (acc == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="vi"><head><title>Welcome</title></head><body>
    <h2>Welcome, \${sessionScope.LOGIN_USER.fullName}</h2>
    <p>Vai tro: \${sessionScope.LOGIN_USER.roleID}</p>
    <a href="MainController?action=Logout">Logout</a>
</body></html>`;
  CODE.logout = servletClass(
    "LogoutController",
    `HttpSession session = request.getSession(false);
if (session != null) {
    session.invalidate();
}
response.sendRedirect("login.jsp");`,
  ).replace("import dao.UserDAO;\nimport dto.UserDTO;\n", "");
  CODE.search = `// Bên trong dao.UserDAO; cần java.sql.*, java.util.*, dto.UserDTO, utils.DBUtils.
private static final String SEARCH =
    "SELECT userID, fullName, roleID, status "
  + "FROM tblUsers WHERE fullName LIKE ?";

public List<UserDTO> search(String keyword) throws Exception {
    List<UserDTO> list = new ArrayList<>();
    Connection cn = null;
    PreparedStatement st = null;
    ResultSet rs = null;
    try {
        cn = DBUtils.getConnection();
        st = cn.prepareStatement(SEARCH);
        st.setString(1, "%" + keyword + "%");
        rs = st.executeQuery();
        while (rs.next()) {
            list.add(new UserDTO(rs.getString("userID"), "",
                rs.getString("fullName"), rs.getString("roleID"),
                rs.getBoolean("status")));
        }
    } finally {
        try { if (rs != null) rs.close(); }
        finally {
            try { if (st != null) st.close(); }
            finally { if (cn != null) cn.close(); }
        }
    }
    return list;
}`;
  CODE.searchController = `// Bên trong processRequest của SearchController.
String url = "login.jsp";
try {
    HttpSession session = request.getSession(false);
    UserDTO acc = session == null ? null
        : (UserDTO) session.getAttribute("LOGIN_USER");
    if (acc == null) {
        request.setAttribute("ERROR", "Please login first");
    } else {
        String keyword = request.getParameter("keyword");
        if (keyword == null) keyword = "";
        List<UserDTO> list = new UserDAO().search(keyword.trim());
        request.setAttribute("LIST_USER", list);
        request.setAttribute("keyword", keyword);
        url = "search.jsp";
    }
} catch (Exception e) {
    log("Error at SearchController", e);
    request.setAttribute("ERROR", "System error");
} finally {
    request.getRequestDispatcher(url).forward(request, response);
}`;
  CODE.searchJsp = `<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%-- Cần thêm JSTL vào Libraries và khối kiểm tra session ở đầu trang. --%>
<p>Welcome, <c:out value="\${sessionScope.LOGIN_USER.fullName}"/></p>
<a href="MainController?action=Logout">Logout</a>
<p><c:out value="\${requestScope.ERROR}"/></p>
<form action="MainController" method="GET">
    <input type="hidden" name="action" value="Search">
    <input name="keyword" value="<c:out value='\${requestScope.keyword}'/>">
    <button>Search</button>
</form>
<table>
    <tr><th>ID</th><th>Ho ten</th><th>Vai tro</th></tr>
    <c:forEach var="u" items="\${requestScope.LIST_USER}">
        <tr>
            <td><c:out value="\${u.userID}"/></td>
            <td><c:out value="\${u.fullName}"/></td>
            <td><c:out value="\${u.roleID}"/></td>
        </tr>
    </c:forEach>
</table>
<c:if test="\${empty requestScope.LIST_USER}">
    <p>Khong tim thay nguoi dung.</p>
</c:if>`;
  const MVC_NODES = [
    node("browser", "Trình duyệt", "Form HTML"),
    node("main", "MainController", "Đọc action"),
    node("controller", "Controller", "Xử lý nghiệp vụ"),
    node("dao", "UserDAO", "SQL / JDBC"),
    node("db", "SQL Server", "tblUsers"),
    node("jsp", "JSP", "Sinh HTML"),
  ];
  const MVC_EDGES = [
    ["browser", "main"],
    ["main", "controller"],
    ["controller", "dao"],
    ["dao", "db"],
    ["controller", "jsp"],
    ["jsp", "browser"],
  ];

  function buildServlet(c) {
    const method = c.method === "GET" ? "GET" : "POST";
    const greeting = "Xin chao " + c.name;
    const form = `<!DOCTYPE html>\n<html lang="vi">\n<head><meta charset="UTF-8"><title>Nhap ten</title></head>\n<body>\n<form action="HelloServlet" method="${method}" accept-charset="UTF-8">\n    <input type="text" name="name" value="${htmlAttribute(c.name)}">\n    <button type="submit">Gui</button>\n</form>\n</body></html>`;
    const req = {
      method,
      "request.name": c.name,
      "request.MESSAGE": "chưa có",
      session: "không dùng trong ví dụ này",
    };
    const nodes = [
      node("browser", "Trình duyệt", "index.html"),
      node("servlet", "HelloServlet", "Java trong Tomcat"),
      node("jsp", "hello.jsp", "Sinh HTML"),
    ];
    return {
      nodes,
      edges: [
        ["browser", "servlet"],
        ["servlet", "jsp"],
        ["jsp", "browser"],
      ],
      files: [
        file("HelloServlet.java", CODE.hello, "Lớp đầy đủ"),
        file("index.html", form, "Trang minh họa"),
        file("hello.jsp", CODE.helloJsp, "Trang minh họa"),
      ],
      steps: [
        step(
          "Đường dẫn tìm đúng Servlet",
          "Khi triển khai, @WebServlet ánh xạ /HelloServlet tới lớp HelloServlet. extends HttpServlet cung cấp hành vi xử lý HTTP được kế thừa.",
          "servlet",
          "HelloServlet.java",
          ["@WebServlet", "extends HttpServlet"],
          { "URL pattern": "/HelloServlet", container: "Tomcat" },
        ),
        step(
          "Form gửi tham số name",
          "Thuộc tính name của ô nhập quyết định tên tham số. Giá trị ô nhập được gửi lên trong request; tên biến Java có thể khác tên tham số.",
          "servlet",
          "index.html",
          ["<form", "<input"],
          req,
          "browser",
        ),
        step(
          method + " chọn do" + (method === "GET" ? "Get" : "Post") + "()",
          "Tomcat gọi service(). HttpServlet.service() phân loại phương thức HTTP để gọi doGet hoặc doPost; không gọi processRequest trực tiếp.",
          "servlet",
          "HelloServlet.java",
          "protected void do" + (method === "GET" ? "Get" : "Post"),
          { ...req, "method Java": method === "GET" ? "doGet()" : "doPost()" },
        ),
        step(
          "Chuyển vào hàm xử lý chung",
          "doGet và doPost trong đoạn code đều gọi processRequest(request, response). Đây là hàm do người viết lớp đặt ra để dùng chung phần nghiệp vụ.",
          "servlet",
          "HelloServlet.java",
          "processRequest(request, response);",
          req,
          null,
          { within: "protected void do" + (method === "GET" ? "Get" : "Post") },
        ),
        step(
          "Chuẩn bị bảng mã và kiểu nội dung",
          method === "POST"
            ? "setCharacterEncoding phải chạy trước getParameter để giải mã phần thân POST. response.setContentType khai báo HTML với UTF-8."
            : "setCharacterEncoding áp dụng cho phần thân request. Với tham số GET trên URL, cách giải mã còn phụ thuộc cấu hình URIEncoding của Tomcat.",
          "servlet",
          "HelloServlet.java",
          ["setCharacterEncoding", "setContentType"],
          { ...req, "response.type": "text/html;charset=UTF-8" },
        ),
        step(
          "Đọc tham số vào biến Java",
          'getParameter("name") trả về String. Nó trả null nếu tham số không tồn tại; gửi một ô rỗng thì có thể nhận chuỗi rỗng "".',
          "servlet",
          "HelloServlet.java",
          "String name =",
          { ...req, "biến name": javaString(c.name) },
        ),
        step(
          "Tạo lời chào và đặt thuộc tính",
          'setAttribute("MESSAGE", ...) gắn dữ liệu do Servlet tạo vào request. Thuộc tính MESSAGE khác với tham số name do trình duyệt gửi lên.',
          "servlet",
          "HelloServlet.java",
          "request.setAttribute",
          { ...req, "request.MESSAGE": greeting },
        ),
        step(
          "forward tới hello.jsp",
          "getRequestDispatcher chọn trang đích. forward chuyển cùng request và response cho JSP trong máy chủ, nên MESSAGE vẫn được đọc ở trang đích.",
          "jsp",
          "HelloServlet.java",
          ["getRequestDispatcher", ".forward"],
          {
            ...req,
            "request.MESSAGE": greeting,
            "request ID": "R1 (giữ nguyên)",
          },
          "servlet",
        ),
        step(
          "JSP đọc MESSAGE để tạo HTML",
          "${requestScope.MESSAGE} lấy thuộc tính từ request. Tomcat thực thi JSP ở máy chủ; trình duyệt nhận HTML đã tạo ra.",
          "jsp",
          "hello.jsp",
          "requestScope.MESSAGE",
          { "request.MESSAGE": greeting, HTML: "<h1>" + greeting + "</h1>" },
        ),
        step(
          "Trình duyệt hiển thị lời chào",
          'Một vòng request–response hoàn tất. forward không đổi thanh địa chỉ sang hello.jsp. Chuỗi "Xin chao " được giữ đúng như trong PowerPoint.',
          "browser",
          "hello.jsp",
          "<h1>",
          {
            URL:
              "/MyWebApp/HelloServlet" +
              (method === "GET"
                ? "?" + new URLSearchParams({ name: c.name })
                : ""),
            "hiển thị": greeting,
            HTTP: "200 OK",
          },
          "jsp",
        ),
      ],
    };
  }

  function buildHttp(c) {
    const method = c.method === "POST" ? "POST" : "GET";
    const query = new URLSearchParams({ name: c.name }).toString();
    const url =
      "/MyWebApp/HelloServlet" + (method === "GET" ? "?" + query : "");
    const raw =
      method +
      " " +
      url +
      " HTTP/1.1\nHost: localhost:8080\n" +
      (method === "POST"
        ? "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\n\n" +
          query
        : "\n");
    return {
      nodes: [
        node("browser", "Trình duyệt", "Client"),
        node("tomcat", "Tomcat", "Cổng 8080"),
        node("servlet", "HelloServlet", "Xử lý request"),
      ],
      edges: [
        ["browser", "tomcat"],
        ["tomcat", "servlet"],
        ["servlet", "browser"],
      ],
      files: [
        file("HTTP request", raw, "HTTP minh họa · lược headers"),
        file(
          "HTTP response",
          "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<h1>Xin chao " +
            c.name +
            "</h1>",
          "HTTP minh họa",
        ),
        file("HelloServlet.java", CODE.hello, "Lớp đầy đủ"),
      ],
      steps: [
        step(
          "Trình duyệt đóng gói request",
          method === "GET"
            ? "GET đặt tham số sau dấu ? của URL, nên dễ lưu và chia sẻ truy vấn."
            : "POST gửi dữ liệu form trong phần thân request. Người dùng vẫn xem được nó trong thẻ Network.",
          "browser",
          "HTTP request",
          method,
          {
            method: method,
            URL: url,
            body: method === "POST" ? query : "không có trong ví dụ này",
          },
        ),
        step(
          "Tomcat nhận request tại cổng 8080",
          "Tomcat đọc HTTP và tạo các đối tượng request, response. Máy chủ SQL Server dùng cổng riêng; ở cấu hình của bài là 1433.",
          "tomcat",
          "HTTP request",
          "Host:",
          { "web port": "8080", "SQL port": "1433", "request ID": "R1" },
          "browser",
        ),
        step(
          "Gọi đúng phương thức Servlet",
          "service() chọn handler theo phương thức HTTP. GET đi vào doGet, POST đi vào doPost. Thiếu hỗ trợ phương thức có thể trả 405.",
          "servlet",
          "HelloServlet.java",
          "protected void do" + (method === "GET" ? "Get" : "Post"),
          { handler: method === "GET" ? "doGet()" : "doPost()", name: c.name },
          "tomcat",
        ),
        step(
          "Máy chủ gửi response",
          "Response có status, headers và có thể có body. 200 chỉ nói yêu cầu thành công ở mức HTTP, không chứng minh nghiệp vụ của bạn hoàn toàn đúng.",
          "browser",
          "HTTP response",
          ["200 OK", "Content-Type"],
          {
            status: "200 OK",
            "content type": "text/html;charset=UTF-8",
            body: "<h1>Xin chao " + c.name + "</h1>",
          },
          "servlet",
        ),
      ],
    };
  }

  function buildEnvironment() {
    const txt = `JDK của project: 8 Update 172 (theo slide)\nJDK chạy NetBeans 13: 11 hoặc 17\nNetBeans: 13\nTomcat: 9.0.113 (phiên bản trong slide)\nSQL Server: 2019\nDriver: sqljdbc4.jar của lớp\n\nWeb: http://localhost:8080/MyWebApp/\nDatabase: localhost,1433`;
    return {
      nodes: [
        node("jdk", "JDK", "Biên dịch Java"),
        node("ide", "NetBeans", "Viết & chạy project"),
        node("server", "Tomcat 9", "Chạy Servlet"),
        node("driver", "sqljdbc4.jar", "Driver JDBC"),
        node("db", "SQL Server", "Lưu dữ liệu"),
        node("browser", "Trình duyệt", "Xem HTML"),
      ],
      edges: [
        ["jdk", "ide"],
        ["ide", "server"],
        ["server", "driver"],
        ["driver", "db"],
        ["server", "browser"],
      ],
      files: [
        file("Môi trường", txt, "Cấu hình lớp học"),
        file("DBUtils.java", CODE.db, "Lớp đầy đủ · thay mật khẩu SQL"),
        file("database.sql", CODE.sql, "Dữ liệu mẫu trong slide"),
      ],
      steps: [
        step(
          "Phân biệt JDK chạy IDE và JDK của project",
          "Slide yêu cầu JDK 8 cho project. Riêng bản NetBeans 13 cần JDK 11+ để chạy IDE; có thể dùng một JDK khác để biên dịch project Java 8.",
          "jdk",
          "Môi trường",
          ["JDK của project", "JDK chạy NetBeans"],
          { project: "JDK 8 theo lớp", IDE: "NetBeans 13 chạy trên JDK 11/17" },
        ),
        step(
          "Tạo Web Application bằng Ant",
          "File > New Project > Java with Ant > Java Web > Web Application. Chọn Tomcat 9 và kiểm tra Java Platform của project.",
          "ide",
          "Môi trường",
          "NetBeans:",
          { project: "MyWebApp", kiểu: "Web Application / Ant" },
          "jdk",
        ),
        step(
          "Ghép Tomcat vào NetBeans",
          "Tools > Servers > Add Server. Chọn Apache Tomcat, trỏ đúng thư mục đã giải nén; sau đó chạy project để kiểm tra trang chào.",
          "server",
          "Môi trường",
          ["Tomcat:", "Web:"],
          { "Servlet API": "javax.servlet.*", HTTP: "localhost:8080" },
          "ide",
        ),
        step(
          "Thêm driver vào Libraries",
          "Project Properties > Libraries > Add JAR/Folder. Thêm sqljdbc4.jar của lớp, dùng đường dẫn tương đối để chép project sang máy khác.",
          "driver",
          "Môi trường",
          "Driver:",
          {
            "driver class": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
            "tham chiếu": "Relative Path",
          },
          "server",
        ),
        step(
          "Cấu hình SQL Server và tạo bảng",
          "Bật SQL Server Authentication theo yêu cầu lớp, bật TCP/IP, xác nhận cổng rồi khởi động lại dịch vụ. Chạy script tạo PRJ301Demo và tblUsers.",
          "db",
          "database.sql",
          ["CREATE DATABASE", "CREATE TABLE"],
          {
            server: "localhost,1433",
            database: "PRJ301Demo",
            table: "tblUsers",
          },
          "driver",
          { table: userTable(BASE_USERS) },
        ),
        step(
          "Kiểm tra kết nối từ Java",
          "DBUtils mở kết nối bằng URL JDBC, tài khoản SQL và mật khẩu của máy bạn. Đăng nhập được SSMS là một mốc kiểm tra; vẫn cần kiểm tra driver và kết nối từ Java.",
          "server",
          "DBUtils.java",
          ["Class.forName", "DriverManager.getConnection"],
          {
            URL: "jdbc:sqlserver://localhost:1433;databaseName=PRJ301Demo",
            "mật khẩu SQL": "thay MAT_KHAU_SQL_CUA_BAN",
          },
          "db",
        ),
      ],
    };
  }

  function buildLifecycle() {
    const text = `@WebServlet("/LifeServlet")
public class LifeServlet extends HttpServlet {
    @Override
    public void init() throws ServletException {
        // Khởi tạo tài nguyên dùng chung một lần cho instance.
    }
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        String name = request.getParameter("name");
        response.getWriter().println("Hello " + name);
    }
    @Override
    public void destroy() {
        // Dọn tài nguyên khi instance được đưa ra khỏi phục vụ.
    }
}`;
    return {
      nodes: [
        node("tomcat", "Tomcat", "Quản lý vòng đời"),
        node("instance", "Servlet instance", "Một instance minh họa"),
        node("request", "Request", "Mỗi lần gọi service()"),
      ],
      edges: [
        ["tomcat", "instance"],
        ["request", "instance"],
      ],
      files: [
        file("LifeServlet.java", text, "Khung minh họa · lược package/import"),
      ],
      steps: [
        step(
          "Tomcat tạo một instance",
          "Container tạo Servlet khi cần hoặc khi khởi động nếu cấu hình load-on-startup. Người viết ứng dụng không tự new Servlet để xử lý HTTP.",
          "instance",
          "LifeServlet.java",
          "class LifeServlet",
          { instance: "S1", "init()": "0 lần", "service()": "0 lần" },
          "tomcat",
        ),
        step(
          "init() chạy một lần cho instance",
          "init chuẩn bị tài nguyên cho S1. Nếu init thành công, instance mới sẵn sàng phục vụ yêu cầu.",
          "instance",
          "LifeServlet.java",
          "public void init",
          { instance: "S1", "init()": "1 lần", "service()": "0 lần" },
        ),
        step(
          "Request đầu tiên đi vào service()",
          "service phân loại HTTP rồi gọi doGet. Biến name nằm trong phương thức và gắn với lần gọi này.",
          "instance",
          "LifeServlet.java",
          ["protected void doGet", "String name"],
          {
            instance: "S1",
            request: "R1",
            name: "Nguyên",
            "service()": "1 lần",
          },
          "request",
        ),
        step(
          "Request tiếp theo dùng lại instance",
          "S1 tiếp tục phục vụ R2 mà không chạy lại init. Nhiều request có thể chạy đồng thời, vì vậy không đặt dữ liệu riêng của một người dùng trong biến instance.",
          "instance",
          "LifeServlet.java",
          "String name",
          {
            instance: "S1 (dùng lại)",
            request: "R2",
            name: "Mai",
            "init()": "vẫn 1 lần",
            "service()": "2 lần",
          },
          "request",
        ),
        step(
          "destroy() khi ngừng phục vụ instance",
          "Khi ứng dụng được dừng hoặc triển khai lại theo vòng đời bình thường, container gọi destroy để dọn tài nguyên. Điều này không xảy ra sau mỗi request.",
          "instance",
          "LifeServlet.java",
          "public void destroy",
          {
            instance: "S1 ngừng phục vụ",
            "destroy()": "1 lần",
            "lần triển khai mới": "có thể tạo instance mới",
          },
          "tomcat",
        ),
      ],
    };
  }

  function buildDispatch(c) {
    const redirect = c.mode === "redirect";
    const code = redirect
      ? `request.setAttribute("MESSAGE", "Xin chao");\nresponse.sendRedirect("hello.jsp");\nreturn;`
      : `request.setAttribute("MESSAGE", "Xin chao");\nrequest.getRequestDispatcher("hello.jsp")\n       .forward(request, response);`;
    const f = redirect ? "Redirect.java" : "Forward.java";
    const initial = {
      "request ID": "R1",
      URL: "/MyWebApp/HelloServlet",
      MESSAGE: "Xin chao",
    };
    return {
      nodes: [
        node("browser", "Trình duyệt", "Thanh địa chỉ"),
        node("servlet", "Servlet", "Request R1"),
        node(
          "jsp",
          "hello.jsp",
          redirect ? "Request mới R2" : "Cùng request R1",
        ),
      ],
      edges: [
        ["browser", "servlet"],
        ["servlet", "jsp"],
        ["servlet", "browser"],
        ["browser", "jsp"],
      ],
      files: [
        file(f, code),
        file("hello.jsp", CODE.helloJsp, "Trang minh họa"),
      ],
      steps: redirect
        ? [
            step(
              "Đặt MESSAGE trên request R1",
              "Thuộc tính này thuộc về đúng request hiện tại. Nó không tự trở thành dữ liệu của session.",
              "servlet",
              f,
              "setAttribute",
              initial,
              "browser",
            ),
            step(
              "Gửi chỉ thị chuyển hướng",
              "sendRedirect ghi response 302 và Location. Máy chủ yêu cầu trình duyệt thực hiện một lần truy cập khác. return dừng phần mã còn lại trong handler.",
              "browser",
              f,
              ["sendRedirect", "return;"],
              { ...initial, HTTP: "302 Found", Location: "hello.jsp" },
              "servlet",
            ),
            step(
              "Trình duyệt gửi một request mới",
              "Trình duyệt truy cập hello.jsp. R2 không mang thuộc tính MESSAGE đã đặt trong R1. Session hợp lệ vẫn có thể được dùng tiếp.",
              "jsp",
              "hello.jsp",
              "requestScope.MESSAGE",
              {
                "request ID": "R2",
                URL: "/MyWebApp/hello.jsp",
                MESSAGE: "null",
                "số request": "2",
              },
              "browser",
            ),
            step(
              "Trang đích không thấy MESSAGE cũ",
              "EL hiển thị rỗng khi không tìm thấy thuộc tính. Nếu muốn giữ dữ liệu qua chuyển hướng, phải chọn cơ chế truyền phù hợp, ví dụ session cho danh tính đăng nhập.",
              "browser",
              "hello.jsp",
              "<h1>",
              {
                HTML: "<h1></h1>",
                URL: "/MyWebApp/hello.jsp",
                "số request": "2",
              },
              "jsp",
            ),
          ]
        : [
            step(
              "Đặt MESSAGE trên request R1",
              "Servlet nhận request và gắn lời chào vào nó. Chưa có phản hồi cuối cùng gửi cho trình duyệt.",
              "servlet",
              f,
              "setAttribute",
              initial,
              "browser",
            ),
            step(
              "Chuyển việc nội bộ bằng forward",
              "RequestDispatcher chuyển cùng request/response tới JSP. Không cần trình duyệt gửi thêm một HTTP request.",
              "jsp",
              f,
              ["getRequestDispatcher", ".forward"],
              { ...initial, "đích xử lý": "hello.jsp", "số request": "1" },
              "servlet",
            ),
            step(
              "JSP đọc thuộc tính được giữ lại",
              "requestScope.MESSAGE vẫn là Xin chao vì JSP xử lý cùng request R1.",
              "jsp",
              "hello.jsp",
              "requestScope.MESSAGE",
              initial,
            ),
            step(
              "HTML về trình duyệt, URL giữ nguyên",
              "Thanh địa chỉ tiếp tục chỉ HelloServlet. Tên trang JSP dùng để tạo HTML là chi tiết xử lý bên máy chủ.",
              "browser",
              "hello.jsp",
              "<h1>",
              { ...initial, HTML: "<h1>Xin chao</h1>", "số request": "1" },
              "jsp",
            ),
          ],
    };
  }

  function buildScopes() {
    const scopeCode = `request.setAttribute("ERROR", "Invalid user or password");
request.getSession().setAttribute("LOGIN_USER", user);
getServletContext().setAttribute("APP_NAME", "PRJ301Demo");

HttpSession session = request.getSession(false);
UserDTO acc = session == null ? null
    : (UserDTO) session.getAttribute("LOGIN_USER");`;
    const base = {
      "application.APP_NAME": "PRJ301Demo",
      "request.ERROR": "chưa có",
      "session.LOGIN_USER": "chưa có",
    };
    return {
      nodes: [
        node("browser", "Trình duyệt A", "Người dùng A"),
        node("request", "Request", "Một yêu cầu"),
        node("session", "Session", "Một phiên"),
        node("app", "Application", "Dùng chung toàn app"),
      ],
      edges: [
        ["browser", "request"],
        ["request", "session"],
        ["request", "app"],
      ],
      files: [
        file("Scopes.java", scopeCode),
        file("LogoutController.java", CODE.logout, "Lớp đầy đủ"),
        file("welcome.jsp", CODE.welcome, "Trang minh họa"),
        file("web.xml", CODE.webxml, "Cấu hình minh họa"),
      ],
      steps: [
        step(
          "Ba nơi lưu dữ liệu",
          "Request sống cùng một yêu cầu; session dùng qua nhiều yêu cầu của một phiên; application dùng chung trong ứng dụng. Chọn theo thời gian và đối tượng cần đọc.",
          "app",
          "Scopes.java",
          "getServletContext()",
          base,
          "request",
        ),
        step(
          "Thông báo lỗi thuộc request",
          "ERROR phục vụ việc hiển thị kết quả của lần gửi form hiện tại. Với forward, trang JSP cùng request sẽ đọc được nó.",
          "request",
          "Scopes.java",
          "request.setAttribute",
          {
            ...base,
            "request ID": "R1",
            "request.ERROR": "Invalid user or password",
          },
          "browser",
        ),
        step(
          "Đăng nhập đúng, lưu UserDTO vào session",
          "LOGIN_USER cần tồn tại khi người dùng mở trang tiếp theo. Đặt nó vào session; application sẽ chia sẻ sai danh tính cho mọi người.",
          "session",
          "Scopes.java",
          "getSession().setAttribute",
          {
            ...base,
            "request ID": "R2",
            "session ID": "S-A",
            "session.LOGIN_USER": "admin / Nguyen Van Quan",
          },
          "request",
        ),
        step(
          "Request mới vẫn nhận ra người dùng",
          "R3 là yêu cầu mới nên không có ERROR của R1. Khi trình duyệt tiếp tục gửi định danh phiên hợp lệ, server tìm lại S-A và đọc LOGIN_USER.",
          "request",
          "Scopes.java",
          ["getSession(false)", "session.getAttribute"],
          {
            ...base,
            "request ID": "R3",
            "session ID": "S-A",
            "session.LOGIN_USER": "admin / Nguyen Van Quan",
          },
          "session",
        ),
        step(
          "Đăng xuất làm mất dữ liệu phiên",
          "getSession(false) không tự tạo một phiên mới. invalidate hủy phiên đang có và các thuộc tính của nó.",
          "session",
          "LogoutController.java",
          ["getSession(false)", "session.invalidate()"],
          {
            ...base,
            "session ID": "S-A đã hủy",
            "session.LOGIN_USER": "không còn",
          },
          "request",
        ),
        step(
          "Truy cập trang bảo vệ sau logout",
          "Trang kiểm tra LOGIN_USER. Không có người đăng nhập thì chuyển về login.jsp và return ngay. Controller có chức năng bảo vệ cũng cần kiểm tra session.",
          "browser",
          "welcome.jsp",
          ["if (acc == null)", "sendRedirect", "return;"],
          { ...base, acc: "null", đích: "login.jsp", HTTP: "302" },
          "request",
        ),
      ],
    };
  }

  function buildJdbc(c) {
    const keyword = c.keyword.trim();
    const users = BASE_USERS.filter((u) =>
      u.fullName.toLowerCase().includes(keyword.toLowerCase()),
    );
    const state = {
      Connection: "chưa mở",
      PreparedStatement: "chưa tạo",
      ResultSet: "chưa có",
    };
    const nodes = [
      node("dao", "UserDAO", "Yêu cầu tìm kiếm"),
      node("driver", "JDBC driver", "sqljdbc4.jar"),
      node("db", "SQL Server", "tblUsers"),
      node("rs", "ResultSet", "Con trỏ kết quả"),
    ];
    const result = {
      nodes,
      edges: [
        ["dao", "driver"],
        ["driver", "db"],
        ["db", "rs"],
        ["rs", "dao"],
      ],
      files: [
        file("UserDAO.java", CODE.search),
        file("DBUtils.java", CODE.db, "Lớp đầy đủ · thay mật khẩu SQL"),
        file("database.sql", CODE.sql, "Dữ liệu mẫu trong slide"),
      ],
      steps: [
        step(
          "1. Nạp driver",
          "Class.forName nạp lớp driver theo khuôn của PowerPoint. JDBC cung cấp giao diện; driver Microsoft cung cấp phần giao tiếp với SQL Server.",
          "driver",
          "DBUtils.java",
          "Class.forName",
          state,
          "dao",
        ),
        step(
          "2. Mở Connection",
          "DBUtils.getConnection trả về kết nối. Mỗi tài nguyên tạo ra phải được đóng khi hoàn tất, kể cả khi xử lý có lỗi.",
          "db",
          "DBUtils.java",
          "DriverManager.getConnection",
          { ...state, Connection: "đã mở" },
          "driver",
        ),
        step(
          "3. Chuẩn bị SQL có dấu hỏi",
          "Chuỗi SQL giữ nguyên cấu trúc. dấu ? là chỗ nhận giá trị, không thêm dấu nháy bao quanh ? trong câu lệnh.",
          "dao",
          "UserDAO.java",
          "prepareStatement(SEARCH)",
          {
            Connection: "đã mở",
            PreparedStatement: "đã tạo",
            SQL: "WHERE fullName LIKE ?",
          },
          "db",
        ),
        step(
          "Gắn từ khóa vào vị trí số 1",
          "Chỉ số tham số JDBC bắt đầu từ 1. Hai dấu % nối vào giá trị để tìm chuỗi chứa từ khóa; chuỗi rỗng tạo thành %% nên khớp mọi họ tên không null.",
          "dao",
          "UserDAO.java",
          "st.setString(1",
          {
            Connection: "đã mở",
            "tham số [1]": "%" + keyword + "%",
            ResultSet: "chưa có",
          },
        ),
        step(
          "4. executeQuery trả ResultSet",
          "SELECT trả bảng kết quả. Con trỏ ban đầu ở trước dòng đầu tiên; chưa thể đọc dữ liệu của dòng cho đến khi next() trả true.",
          "rs",
          "UserDAO.java",
          "rs = st.executeQuery()",
          {
            Connection: "đã mở",
            ResultSet: users.length + " dòng",
            "con trỏ": "trước dòng đầu",
          },
          "db",
          { table: userTable(users, "ResultSet · kết quả truy vấn") },
        ),
      ],
    };
    users.forEach((u, i) =>
      result.steps.push(
        step(
          "next() → dòng " + (i + 1),
          "next() dịch con trỏ đến một dòng và trả true. getString/getBoolean đọc cột của dòng hiện tại; UserDTO mang dữ liệu về lớp điều khiển.",
          "rs",
          "UserDAO.java",
          ["while (rs.next())", "list.add(new UserDTO"],
          {
            "rs.next()": "true",
            "dòng hiện tại": String(i + 1),
            fullName: u.fullName,
            "list.size()": String(i + 1),
          },
          null,
          { table: userTable(users, "ResultSet · dòng đang đọc", i) },
        ),
      ),
    );
    result.steps.push(
      step(
        "next() trả false, hết bảng kết quả",
        "Vòng while dừng. Khi không tìm thấy gì, phương thức vẫn trả về danh sách rỗng để tầng trên xử lý an toàn.",
        "rs",
        "UserDAO.java",
        "while (rs.next())",
        { "rs.next()": "false", "list.size()": String(users.length) },
        null,
        { table: userTable(users) },
      ),
    );
    result.steps.push(
      step(
        "5. Đóng tài nguyên theo thứ tự ngược",
        "Đóng ResultSet, rồi PreparedStatement, rồi Connection. Mẫu này lồng finally để một lần close ném lỗi không ngăn việc đóng tài nguyên tiếp theo.",
        "dao",
        "UserDAO.java",
        ["if (rs != null)", "if (st != null)", "if (cn != null)"],
        {
          ResultSet: "đã đóng",
          PreparedStatement: "đã đóng",
          Connection: "đã đóng",
          "giá trị trả về": users.length + " UserDTO",
        },
        "rs",
        { table: userTable(users, "Danh sách DTO trả về") },
      ),
    );
    return result;
  }

  function buildPrepared(c) {
    const unsafe = c.mode === "concat";
    const injected = c.password === "' OR '1'='1";
    const raw =
      "SELECT * FROM tblUsers WHERE userID = 'admin' AND password = '" +
      c.password +
      "'";
    const safeText = `String sql = "SELECT userID, fullName, roleID, status "
           + "FROM tblUsers WHERE userID = ? AND password = ?";
PreparedStatement st = cn.prepareStatement(sql);
st.setString(1, "admin");
st.setString(2, password);
ResultSet rs = st.executeQuery();`;
    const unsafeText = `// Ví dụ cố ý sai để quan sát vấn đề.
String sql = "SELECT * FROM tblUsers WHERE userID = 'admin'"
           + " AND password = '" + password + "'";
Statement st = cn.createStatement();
ResultSet rs = st.executeQuery(sql);`;
    const found =
      unsafe && injected
        ? BASE_USERS
        : BASE_USERS.filter(
            (u) => u.userID === "admin" && u.password === c.password,
          );
    const filename = unsafe ? "Statement.java" : "PreparedStatement.java";
    return {
      nodes: [
        node("input", "Dữ liệu nhập", "password"),
        node(
          "statement",
          unsafe ? "Statement" : "PreparedStatement",
          unsafe ? "Ghép chuỗi SQL" : "Gắn tham số",
        ),
        node("db", "SQL Server", "Phân tích & thực thi"),
      ],
      edges: [
        ["input", "statement"],
        ["statement", "db"],
      ],
      files: [
        file(filename, unsafe ? unsafeText : safeText),
        file(
          "SQL và giá trị",
          unsafe
            ? raw
            : 'SQL: SELECT userID, fullName, roleID, status\n     FROM tblUsers WHERE userID = ? AND password = ?\n\n[1] = "admin"\n[2] = ' +
                javaString(c.password),
          "Ảnh chụp dữ liệu mô phỏng",
        ),
      ],
      steps: [
        step(
          "Xem giá trị người dùng nhập",
          "Đây là dữ liệu của ô password. Một giá trị có dấu nháy vẫn phải được xử lý như dữ liệu đầu vào.",
          "input",
          filename,
          unsafe ? "password +" : "st.setString(2",
          { userID: "admin", password: javaString(c.password) },
        ),
        step(
          unsafe
            ? "Ghép dữ liệu vào cú pháp SQL"
            : "Giữ câu lệnh và giá trị tách biệt",
          unsafe
            ? "Ghép trực tiếp làm ký tự trong mật khẩu trở thành một phần câu lệnh. Chuỗi minh họa có thể thay đổi điều kiện WHERE."
            : "setString gắn toàn bộ giá trị vào tham số. Kể cả dấu nháy hay chữ OR cũng được coi là giá trị của mật khẩu.",
          "statement",
          filename,
          unsafe ? "AND password =" : "st.setString(2",
          {
            SQL: unsafe ? raw : "WHERE userID = ? AND password = ?",
            "giá trị [2]": c.password,
          },
          "input",
        ),
        step(
          "Thực thi trên dữ liệu mẫu",
          unsafe && injected
            ? "Trong ví dụ này, OR '1'='1' tạo điều kiện luôn đúng nên trả cả hai dòng. Kiểm tra đăng nhập dựa vào rs.next() sẽ bị đánh lừa."
            : "Truy vấn chỉ tìm bản ghi khớp các giá trị. Mật khẩu phải đúng với dữ liệu mẫu để nhận một dòng.",
          "db",
          filename,
          "executeQuery",
          {
            "số dòng": String(found.length),
            "rs.next()": found.length ? "true" : "false",
          },
          "statement",
          { table: userTable(found, "Kết quả mô phỏng") },
        ),
        step(
          unsafe && injected
            ? "Điều kiện đăng nhập đã bị vượt qua"
            : found.length
              ? "Tìm thấy tài khoản khớp"
              : "Không có tài khoản khớp",
          unsafe
            ? "Mô phỏng chỉ minh họa đúng chuỗi trong PowerPoint; đây không phải bộ máy thực thi SQL. Trong DAO của bài, hãy dùng PreparedStatement."
            : "Kết cấu câu lệnh không thay đổi theo mật khẩu. Đây là lý do dùng dấu hỏi và setString cho đầu vào.",
          "statement",
          filename,
          unsafe ? "Statement st" : "PreparedStatement st",
          {
            "kết quả": found.length ? "có dữ liệu" : "không có dữ liệu",
            "cách dùng trong bài": "PreparedStatement",
          },
          "db",
          { table: userTable(found) },
        ),
      ],
    };
  }

  function buildMvc(c) {
    const search = c.action === "Search";
    const files = [
      file("MainController.java", CODE.main, "Lớp đầy đủ · bổ sung nhánh CRUD"),
      file("SearchController.java", CODE.searchController),
      file("UserDAO.java", CODE.search),
      file("UserDTO.java", CODE.dto, "Lớp đầy đủ"),
      file("search.jsp", CODE.searchJsp),
      file("web.xml", CODE.webxml, "Cấu hình minh họa"),
    ];
    const initial = {
      action: c.action === "none" ? "null" : c.action,
      url: "login.jsp",
      "request ID": "R1",
    };
    const steps = [
      step(
        "Mọi chức năng đi qua cửa vào MainController",
        "Form gửi về MainController, kèm tham số action để phân biệt chức năng. web.xml còn đặt MainController làm welcome-file của ứng dụng.",
        "main",
        "web.xml",
        ["url-pattern", "welcome-file>"],
        initial,
        "browser",
      ),
      step(
        "Đặt đường lui trước khi rẽ nhánh",
        "url bắt đầu bằng login.jsp. Nhờ kiểm tra action != null, truy cập lần đầu không có action vẫn có một đích hợp lệ.",
        "main",
        "MainController.java",
        ["String url = WELCOME", "if (action != null)"],
        initial,
      ),
    ];
    if (!search) {
      steps.push(
        step(
          "Không có nhánh phù hợp, dùng đường lui",
          "Trường hợp không có action hoặc action không khớp giữ đích login.jsp. Mô hình có một nơi tập trung để xác định trang tiếp theo.",
          "jsp",
          "MainController.java",
          ["default:", "getRequestDispatcher"],
          initial,
          "main",
        ),
      );
      return { nodes: MVC_NODES, edges: MVC_EDGES, files, steps };
    }
    steps.push(
      step(
        "Chọn SearchController",
        "MainController chỉ điều phối, không viết SQL và không tự tạo bảng HTML. forward gửi request đến controller chức năng.",
        "controller",
        "MainController.java",
        ['case "Search"', "getRequestDispatcher"],
        { ...initial, url: "SearchController" },
        "main",
      ),
      step(
        "Controller kiểm tra phiên và đọc dữ liệu",
        "Controller xác nhận người dùng đã đăng nhập, đọc keyword, sau đó gọi DAO. Mô phỏng này bắt đầu với một phiên admin hợp lệ.",
        "controller",
        "SearchController.java",
        ["getSession(false)", "new UserDAO().search"],
        {
          "session.LOGIN_USER": "admin",
          keyword: "",
          "DAO method": 'search("")',
        },
      ),
      step(
        "DAO chứa SQL và làm việc với JDBC",
        "DAO lấy kết nối, chuẩn bị SQL rồi gắn tham số. Model gồm phần truy cập dữ liệu và các đối tượng mang dữ liệu như DTO.",
        "dao",
        "UserDAO.java",
        ["prepareStatement(SEARCH)", "setString"],
        { SQL: "SELECT ... WHERE fullName LIKE ?", "[1]": "%%" },
        "controller",
      ),
      step(
        "SQL Server trả ResultSet cho DAO",
        "Cơ sở dữ liệu trả các dòng cho DAO. JSP nhận dữ liệu qua controller, không nhận trực tiếp kết nối SQL Server.",
        "dao",
        "UserDAO.java",
        "executeQuery",
        { ResultSet: "2 dòng", "request.LIST_USER": "chưa đặt" },
        "db",
        { table: userTable(BASE_USERS, "ResultSet tại DAO") },
      ),
      step(
        "DTO mang dữ liệu của từng dòng",
        "UserDTO có các trường private, constructor và getter/setter. Nó không chứa lệnh SQL hay xử lý HTTP.",
        "dao",
        "UserDTO.java",
        ["private String", "public UserDTO(String"],
        {
          "DTO đầu tiên": "admin / Nguyen Van Quan",
          roleID: "AD",
          status: "true",
        },
      ),
      step(
        "Controller đặt danh sách vào request",
        "DAO trả List<UserDTO> về controller. Controller đặt LIST_USER và keyword vào request rồi chọn search.jsp.",
        "controller",
        "SearchController.java",
        [
          'setAttribute("LIST_USER"',
          'setAttribute("keyword"',
          'url = "search.jsp"',
        ],
        {
          "request.LIST_USER": "List<UserDTO> · 2 phần tử",
          "request.keyword": "",
          url: "search.jsp",
        },
        "dao",
      ),
      step(
        "View lặp danh sách để tạo HTML",
        "JSP dùng JSTL/EL để trình bày dữ liệu đã có. ${u.fullName} truy cập thuộc tính qua getter getFullName().",
        "jsp",
        "search.jsp",
        ["c:forEach", "u.fullName"],
        { View: "search.jsp", getter: "getFullName()", "dòng hiển thị": "2" },
        "controller",
        { table: userTable(BASE_USERS, "Bảng HTML") },
      ),
      step(
        "Trình duyệt nhận kết quả",
        "Luồng kết thúc bằng HTML. MainController điều phối, controller xử lý yêu cầu, DAO truy cập dữ liệu, DTO mang dữ liệu và JSP trình bày.",
        "browser",
        "search.jsp",
        "</table>",
        { URL: "/MyWebApp/MainController?action=Search", HTTP: "200 OK" },
        "jsp",
        { table: userTable(BASE_USERS, "Bảng người dùng") },
      ),
    );
    return { nodes: MVC_NODES, edges: MVC_EDGES, files, steps };
  }

  function buildLogin(c) {
    const id = c.userID.trim(),
      password = c.password;
    const user = DEMO_USERS.find(
      (u) => u.userID === id && u.password === password,
    );
    const empty = !id || !password;
    const system = c.preset === "system" && !empty;
    const error = empty
      ? "Please enter user and password"
      : system
        ? "System error"
        : !user
          ? "Invalid user or password"
          : !user.status
            ? "This account is disabled"
            : null;
    const ok = !error;
    const data = {
      "request.userID": c.userID,
      "request.password": password
        ? "•".repeat(Math.min(password.length, 12))
        : '""',
      action: "Login",
      url: "login.jsp",
    };
    const files = [
      file("login.jsp", CODE.loginJsp, "Trang minh họa"),
      file("MainController.java", CODE.main, "Lớp đầy đủ"),
      file("LoginController.java", CODE.login, "Lớp đầy đủ"),
      file("UserDAO.java", CODE.daoLogin),
      file("welcome.jsp", CODE.welcome, "Trang minh họa"),
    ];
    const steps = [
      step(
        "Gửi form đăng nhập bằng POST",
        'Các ô có name="userID", name="password". Nút có name="action" và value="Login", nên MainController nhận biết thao tác đăng nhập.',
        "main",
        "login.jsp",
        ["<form", 'name="action"'],
        data,
        "browser",
      ),
      step(
        "MainController chọn nhánh Login",
        "Đọc action rồi chọn LoginController. Việc chuyển tiếp diễn ra trong cùng request, các tham số form được giữ lại.",
        "controller",
        "MainController.java",
        ['case "Login"', "getRequestDispatcher"],
        { ...data, url: "LoginController" },
        "main",
      ),
      step(
        "Kiểm tra dữ liệu thiếu tại server",
        "Servlet kiểm tra null và chuỗi rỗng. required của HTML chỉ là kiểm tra phía client; mô phỏng này cho phép gửi rỗng để xem nhánh kiểm tra ở server.",
        "controller",
        "LoginController.java",
        ["userID == null", "password == null"],
        {
          ...data,
          "thiếu thông tin": empty ? "true" : "false",
          "truy cập DB": "chưa",
        },
      ),
    ];
    if (!empty) {
      steps.push(
        step(
          "Gọi DAO để kiểm tra thông tin",
          "Chỉ khi có đủ dữ liệu, controller mới gọi checkLogin. UserID được trim; mật khẩu giữ nguyên vì khoảng trắng có thể là một phần mật khẩu.",
          "dao",
          "LoginController.java",
          "dao.checkLogin",
          { ...data, "userID truyền xuống": id },
          "controller",
        ),
      );
      steps.push(
        step(
          "Gắn hai tham số của truy vấn",
          "Tham số số 1 là userID, số 2 là password. Mô phỏng dùng dữ liệu mẫu trong slide và thêm tài khoản locked để xem nhánh status.",
          "db",
          "UserDAO.java",
          ["st.setString(1", "st.setString(2", "executeQuery"],
          {
            SQL: "WHERE userID = ? AND password = ?",
            "[1]": id,
            "[2]": password,
            DB: "PRJ301Demo",
          },
          "dao",
        ),
      );
      if (!system)
        steps.push(
          step(
            user ? "ResultSet có một dòng" : "ResultSet không có dòng",
            user
              ? "DAO dựng UserDTO rồi trả về. DAO không tự quyết định tài khoản bị khóa có được đăng nhập không; controller kiểm tra status."
              : "rs.next() trả false. Biến user vẫn là null, được trả về cho controller để chọn nhánh báo sai tài khoản.",
            "controller",
            "UserDAO.java",
            ["if (rs.next())", "return user;"],
            {
              "DAO trả về": user ? "UserDTO(" + user.userID + ")" : "null",
              status: user ? String(user.status) : "không có",
            },
            "dao",
            { table: userTable(user ? [user] : [], "Kết quả xác thực") },
          ),
        );
    }
    if (ok)
      steps.push(
        step(
          "Tài khoản hợp lệ, lưu vào session",
          "Sau khi kiểm tra user khác null và status=true, controller đặt LOGIN_USER vào session. url được đổi từ login.jsp sang welcome.jsp.",
          "controller",
          "LoginController.java",
          ["getSession().setAttribute", "url = SUCCESS"],
          {
            "session.LOGIN_USER": user.userID + " / " + user.fullName,
            "request.ERROR": "không có",
            url: "welcome.jsp",
          },
        ),
      );
    else
      steps.push(
        step(
          system
            ? "Bắt lỗi hệ thống"
            : empty
              ? "Nhánh thiếu thông tin"
              : !user
                ? "Nhánh sai thông tin"
                : "Nhánh tài khoản bị khóa",
          system
            ? "Ngoại lệ từ DAO đi lên catch. Controller ghi log để gỡ lỗi và đặt một thông báo phù hợp cho giao diện."
            : "Thông báo được đặt vào request.ERROR. url giữ nguyên login.jsp, session không được đánh dấu là đã đăng nhập.",
          "controller",
          "LoginController.java",
          javaString(error),
          {
            "request.ERROR": error,
            "session.LOGIN_USER": "không có",
            url: "login.jsp",
            "đã gọi DB": empty ? "không" : "có",
          },
        ),
      );
    steps.push(
      step(
        "forward tới trang kết quả",
        "Khối finally có một vị trí chuyển tiếp cuối trong controller này. Với forward, JSP tiếp tục đọc được ERROR của request hoặc LOGIN_USER của session.",
        "jsp",
        "LoginController.java",
        "getRequestDispatcher(url)",
        {
          "request.ERROR": error || "không có",
          "session.LOGIN_USER": ok ? user.fullName : "không có",
          đích: ok ? "welcome.jsp" : "login.jsp",
          "request ID": "R1",
        },
        "controller",
      ),
    );
    steps.push(
      step(
        ok ? "Hiển thị Welcome kèm họ tên" : "Hiển thị lỗi trên form",
        ok
          ? "welcome.jsp kiểm tra session ở đầu trang, rồi dùng EL lấy fullName qua getFullName(). Link Logout giúp kết thúc phiên."
          : "login.jsp đọc ${requestScope.ERROR}. Thiếu dòng này thì Servlet vẫn đặt lỗi nhưng người dùng không thấy thông báo.",
        "browser",
        ok ? "welcome.jsp" : "login.jsp",
        ok ? "sessionScope.LOGIN_USER.fullName" : "requestScope.ERROR",
        {
          "hiển thị": ok ? "Welcome, " + user.fullName : error,
          URL: "/MyWebApp/MainController",
          HTTP: "200 OK",
        },
        "jsp",
      ),
    );
    return {
      nodes: MVC_NODES.map((n) =>
        n.id === "controller" ? { ...n, label: "LoginController" } : n,
      ),
      edges: MVC_EDGES,
      files,
      steps,
    };
  }

  function buildCrud(c) {
    const op = c.operation;
    const isSearch = op === "Search";
    const id = c.userID.trim(),
      name = c.fullName.trim();
    const before = BASE_USERS.map((u) => ({ ...u }));
    const after = before.map((u) => ({ ...u }));
    const exists = before.some((u) => u.userID === id);
    let error = "",
      affected = 0;
    if (!isSearch) {
      if (!id) error = "userID không được rỗng";
      else if ((op === "Create" || op === "Update") && !name)
        error = "fullName không được rỗng";
      else if (op === "Create" && exists) error = "userID đã tồn tại";
      else if (op === "Delete" && c.confirm === "no")
        error = "Đã hủy thao tác xóa";
      else if (op === "Create") {
        after.push({
          userID: id,
          password: "123456",
          fullName: name,
          roleID: c.roleID,
          status: true,
        });
        affected = 1;
      } else if (op === "Update") {
        const u = after.find((u) => u.userID === id);
        if (u) {
          u.fullName = name;
          u.roleID = c.roleID;
          affected = 1;
        }
      } else if (op === "Delete") {
        const pos = after.findIndex((u) => u.userID === id);
        if (pos >= 0) {
          after.splice(pos, 1);
          affected = 1;
        }
      }
      if (!error && !affected) error = "Không có bản ghi khớp userID";
    }
    const keyword = c.keyword.trim();
    const list = (isSearch ? before : after).filter((u) =>
      u.fullName.toLowerCase().includes(keyword.toLowerCase()),
    );
    const sqls = {
      Search:
        "SELECT userID, fullName, roleID, status FROM tblUsers WHERE fullName LIKE ?",
      Create:
        "INSERT INTO tblUsers (userID,password,fullName,roleID,status) VALUES (?,?,?,?,?)",
      Update: "UPDATE tblUsers SET fullName = ?, roleID = ? WHERE userID = ?",
      Delete: "DELETE FROM tblUsers WHERE userID = ?",
    };
    const bindings = {
      Search: ["%" + keyword + "%"],
      Create: [id, "123456", name, c.roleID, true],
      Update: [name, c.roleID, id],
      Delete: [id],
    };
    const writeDao = `// Các phương thức trong UserDAO. Ví dụ bổ sung, dùng try-with-resources.
// Cần import java.sql.*, dto.UserDTO, utils.DBUtils.
public boolean exists(String userID) throws Exception {
    String sql = "SELECT userID FROM tblUsers WHERE userID = ?";
    try (Connection cn = DBUtils.getConnection();
         PreparedStatement st = cn.prepareStatement(sql)) {
        st.setString(1, userID);
        try (ResultSet rs = st.executeQuery()) { return rs.next(); }
    }
}

public boolean create(UserDTO u) throws Exception {
    String sql = "INSERT INTO tblUsers "
        + "(userID,password,fullName,roleID,status) VALUES (?,?,?,?,?)";
    try (Connection cn = DBUtils.getConnection();
         PreparedStatement st = cn.prepareStatement(sql)) {
        st.setString(1, u.getUserID());
        st.setString(2, u.getPassword());
        st.setString(3, u.getFullName());
        st.setString(4, u.getRoleID());
        st.setBoolean(5, u.isStatus());
        return st.executeUpdate() > 0;
    }
}

public boolean update(UserDTO u) throws Exception {
    String sql = "UPDATE tblUsers SET fullName = ?, roleID = ? WHERE userID = ?";
    try (Connection cn = DBUtils.getConnection();
         PreparedStatement st = cn.prepareStatement(sql)) {
        st.setString(1, u.getFullName());
        st.setString(2, u.getRoleID());
        st.setString(3, u.getUserID()); // ID là tham số CUỐI.
        return st.executeUpdate() > 0;
    }
}

public boolean delete(String userID) throws Exception {
    String sql = "DELETE FROM tblUsers WHERE userID = ?";
    try (Connection cn = DBUtils.getConnection();
         PreparedStatement st = cn.prepareStatement(sql)) {
        st.setString(1, userID);
        return st.executeUpdate() > 0;
    }
}`;
    const writeController = `// Phần xử lý trong controller ghi tương ứng (Create/Update/Delete).
// Bổ sung theo yêu cầu CRUD. Đọc và kiểm tra đầy đủ input trước đoạn này.
String url = "SearchController";
try {
    HttpSession session = request.getSession(false);
    UserDTO acc = session == null ? null
        : (UserDTO) session.getAttribute("LOGIN_USER");
    if (acc == null) {
        url = "login.jsp";
        request.setAttribute("ERROR", "Please login first");
    } else {
        UserDAO dao = new UserDAO();
        boolean done;
        ${
          op === "Create"
            ? `if (dao.exists(userID)) {
            request.setAttribute("ERROR", "userID da ton tai");
            done = false;
        } else {
            done = dao.create(user);
        }`
            : op === "Update"
              ? "done = dao.update(user);"
              : "done = dao.delete(userID);"
        }
        if (!done && request.getAttribute("ERROR") == null)
            request.setAttribute("ERROR", "Thao tac khong thanh cong");
        // SearchController đọc lại bảng, kể cả khi số dòng tác động bằng 0.
    }
} catch (Exception e) {
    log("Error at ${op}Controller", e);
    request.setAttribute("ERROR", "System error");
} finally {
    request.getRequestDispatcher(url).forward(request, response);
}`;
    const f = op + "Controller.java";
    const files = [
      file(f, isSearch ? CODE.searchController : writeController),
      file(
        "UserDAO.java",
        isSearch ? CODE.search : writeDao,
        isSearch
          ? "Trích đoạn học tập"
          : "CRUD bổ sung · đóng tài nguyên tự động",
      ),
      file("SearchController.java", CODE.searchController),
      file("search.jsp", CODE.searchJsp),
      file("MainController.java", CODE.main, "Lớp đầy đủ · bổ sung CRUD"),
    ].filter((v, i, a) => a.findIndex((x) => x.name === v.name) === i);
    if (op === "Delete") {
      files.push(
        file(
          "delete-form.jsp",
          `<form action="MainController" method="POST"\n      onsubmit="return confirm('Xoa nguoi dung nay?');">\n    <input type="hidden" name="action" value="Delete">\n    <input type="hidden" name="userID" value="${htmlAttribute(id)}">\n    <button type="submit">Delete</button>\n</form>`,
          "Biểu mẫu xác nhận minh họa",
        ),
      );
      if (c.confirm === "no")
        return {
          nodes: MVC_NODES,
          edges: MVC_EDGES,
          files,
          steps: [
            step(
              "Người dùng bấm Delete",
              "Hộp xác nhận xuất hiện trước khi trình duyệt gửi form POST. Dữ liệu bên máy chủ chưa bị thay đổi.",
              "browser",
              "delete-form.jsp",
              "onsubmit=",
              { userID: id, "request gửi đi": "chưa có" },
              null,
              { table: userTable(before, "Bảng ban đầu") },
            ),
            step(
              "Chọn Hủy, dừng ngay tại trình duyệt",
              "confirm trả false nên form không được submit. MainController, DAO và câu lệnh DELETE đều không chạy trong tình huống này.",
              "browser",
              "delete-form.jsp",
              "return confirm",
              {
                "confirm()": "false",
                "request gửi đi": "không có",
                "số dòng ghi": "0",
              },
              null,
              { table: userTable(before, "Bảng giữ nguyên") },
            ),
          ],
        };
    }
    const steps = [
      step(
        "Gửi action=" + op,
        isSearch
          ? "Tìm kiếm dùng GET và gửi keyword. Khi mở lại URL cùng truy vấn, người dùng có thể thực hiện lại thao tác đọc."
          : "Thao tác ghi dùng POST. Mô phỏng bắt đầu với phiên admin hợp lệ và hai tài khoản mẫu, mọi lần áp dụng đều dựng lại dữ liệu ban đầu.",
        "main",
        "MainController.java",
        'case "' + op + '"',
        {
          action: op,
          method: isSearch ? "GET" : "POST",
          "session.LOGIN_USER": "admin",
          keyword: keyword,
        },
        "browser",
        { table: userTable(before, "Bảng trước thao tác") },
      ),
      step(
        "Controller kiểm tra phiên và đầu vào",
        "Controller chịu trách nhiệm kiểm tra dữ liệu trước khi gọi DAO. Không lấy danh tính đăng nhập từ một userID mà người dùng tự gửi lên.",
        "controller",
        f,
        "if (acc == null)",
        {
          userID: isSearch ? "không dùng" : id,
          keyword: keyword,
          session: "hợp lệ",
          "kiểm tra": error && affected === 0 ? error : "hợp lệ",
        },
        "main",
        { table: userTable(before) },
      ),
    ];
    const stopsBeforeWrite =
      !!error && error !== "Không có bản ghi khớp userID";
    if (stopsBeforeWrite) {
      steps.push(
        step(
          "Không thực hiện lệnh ghi",
          error +
            ". " +
            (op === "Delete" && c.confirm === "no"
              ? "Người dùng đã hủy hộp xác nhận, vì vậy không gửi yêu cầu xóa trong ứng dụng thật."
              : "Với trùng ID, DAO có thể đọc để kiểm tra nhưng không thực hiện INSERT."),
          "controller",
          f,
          op === "Create" ? "dao.exists" : "String url =",
          { "kết quả": error, "số dòng ghi": "0", bảng: "giữ nguyên" },
          null,
          { table: userTable(before) },
        ),
      );
    } else {
      steps.push(
        step(
          "DAO chuẩn bị câu lệnh " + op,
          "SQL nằm trong DAO. Mỗi dấu hỏi tương ứng đúng một giá trị theo thứ tự bắt đầu từ 1.",
          "dao",
          "UserDAO.java",
          isSearch
            ? "prepareStatement(SEARCH)"
            : op === "Create"
              ? "public boolean create"
              : op === "Update"
                ? "public boolean update"
                : "public boolean delete",
          {
            SQL: sqls[op],
            ...Object.fromEntries(
              bindings[op].map((x, i) => [
                "tham số [" + (i + 1) + "]",
                String(x),
              ]),
            ),
          },
          "controller",
          { table: userTable(before) },
        ),
      );
      steps.push(
        step(
          isSearch
            ? "SELECT đọc bảng"
            : op === "Update"
              ? "UPDATE dùng ID ở vị trí cuối"
              : op === "Create"
                ? "INSERT thêm bản ghi"
                : "DELETE tác động theo ID",
          isSearch
            ? "executeQuery trả ResultSet để DAO đọc thành List<UserDTO>."
            : op === "Update"
              ? "Đếm ba dấu hỏi: fullName, roleID rồi mới đến userID trong WHERE. Sai thứ tự có thể không tác động dòng nào."
              : "executeUpdate trả số dòng bị tác động. So sánh > 0 cho biết có bản ghi được ghi hay không.",
          "db",
          "UserDAO.java",
          isSearch
            ? "rs = st.executeQuery()"
            : op === "Update"
              ? ["st.setString(3, u.getUserID())", "return st.executeUpdate()"]
              : "return st.executeUpdate()",
          {
            "kết quả": isSearch
              ? list.length + " dòng"
              : affected + " dòng bị tác động",
            "thông báo": error || "thao tác thành công",
          },
          "dao",
          {
            table: userTable(
              isSearch ? list : after,
              isSearch ? "ResultSet" : "Bảng sau thao tác",
            ),
            within: isSearch
              ? null
              : "public boolean " + op.toLowerCase() + "(",
          },
        ),
      );
    }
    if (!isSearch)
      steps.push(
        step(
          "Quay về SearchController để đọc lại",
          "Sau thao tác ghi, controller chuyển tiếp tới SearchController. Controller tìm kiếm chạy lại truy vấn để nạp dữ liệu mới cho request; không đi thẳng tới JSP với danh sách cũ.",
          "controller",
          f,
          ['String url = "SearchController"', "getRequestDispatcher"],
          {
            đích: "SearchController",
            ERROR: error || "không có",
            "bảng sau thao tác": after.length + " dòng",
          },
          "dao",
          { table: userTable(after) },
        ),
      );
    steps.push(
      step(
        "Đặt danh sách và từ khóa vào request",
        "LIST_USER mang kết quả hiện tại; keyword được đặt lại để ô tìm kiếm giữ nguyên nội dung sau khi hiển thị trang.",
        "controller",
        "SearchController.java",
        ['setAttribute("LIST_USER"', 'setAttribute("keyword"'],
        {
          "request.LIST_USER": list.length + " phần tử",
          "request.keyword": keyword,
          "request.ERROR": error || "không có",
        },
        null,
        { table: userTable(list, "Danh sách đã nạp lại") },
      ),
    );
    steps.push(
      step(
        "JSP hiển thị bảng kết quả",
        "c:forEach lặp danh sách. Trường hợp rỗng có thông báo riêng. Các ví dụ JSTL cần thư viện tương ứng trong project NetBeans.",
        "jsp",
        "search.jsp",
        ["c:forEach", "empty requestScope.LIST_USER"],
        {
          view: "search.jsp",
          "số dòng hiển thị": String(list.length),
          keyword: keyword,
          ERROR: error || "không có",
        },
        "controller",
        { table: userTable(list, "Kết quả trên giao diện") },
      ),
    );
    return {
      nodes: MVC_NODES.map((n) =>
        n.id === "controller" ? { ...n, label: op + "Controller" } : n,
      ),
      edges: MVC_EDGES,
      files,
      steps,
    };
  }

  const DEBUG_CASES = {
    404: {
      label: "404 · sai đường dẫn",
      cause: "Không tìm thấy tài nguyên ở URL đang yêu cầu.",
      log: "HTTP/1.1 404 Not Found\nRequest URL: /MyWebApp/HeloServlet",
      vars: { "URL đang gọi": "HeloServlet", urlPatterns: "/HelloServlet" },
      code: '@WebServlet(urlPatterns = {"/HelloServlet"})\n// Form phải dùng đúng tên:\n<form action="HelloServlet" method="POST">',
      fix: "Đối chiếu context path, urlPatterns và action của form. 404 không đủ để kết luận sai phiên bản Tomcat.",
      focus: 'action="HelloServlet"',
    },
    405: {
      label: "405 · thiếu handler",
      cause:
        "Server nhận biết tài nguyên nhưng không hỗ trợ phương thức HTTP này.",
      log: "HTTP/1.1 405 Method Not Allowed\nRequest method: POST\nServlet đang chỉ cài doGet().",
      vars: { method: "POST", handler: "thiếu doPost" },
      code: "@Override\nprotected void doPost(HttpServletRequest request,\n        HttpServletResponse response)\n        throws ServletException, IOException {\n    processRequest(request, response);\n}",
      fix: "Cài doPost và gọi hàm xử lý chung, hoặc chọn phương thức phù hợp với nghiệp vụ.",
      focus: "protected void doPost",
    },
    driver: {
      label: "JDBC · thiếu driver",
      cause: "JVM không tìm thấy lớp driver SQL Server trên classpath.",
      log: "HTTP/1.1 500 Internal Server Error\nCaused by: java.lang.ClassNotFoundException:\ncom.microsoft.sqlserver.jdbc.SQLServerDriver",
      vars: { driver: "chưa có trong Libraries", URL: "chưa mở kết nối" },
      code: '// NetBeans: Project Properties > Libraries > Add JAR/Folder\n// Chọn sqljdbc4.jar, Relative Path.\nClass.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");',
      fix: "Thêm đúng JAR vào project, Clean and Build rồi chạy lại. Đổi mật khẩu SQL không sửa được lỗi thiếu lớp driver.",
      focus: "Class.forName",
    },
    param: {
      label: "Form · tham số bị null",
      cause: "Tên name của input không khớp khóa mà Servlet đọc.",
      log: "HTTP/1.1 200 OK\nTrong Debug: userID == null\nForm gửi: txtUser=admin",
      vars: {
        "form.name": "txtUser",
        getParameter: "userID",
        "giá trị Java": "null",
      },
      code: '<!-- Sửa name của ô nhập cho khớp -->\n<input name="userID" value="admin">\n\nString userID = request.getParameter("userID");',
      fix: 'So từng chữ giữa name="userID" và getParameter("userID"). Thay id của input không thay được tên tham số HTTP.',
      focus: 'name="userID"',
    },
    committed: {
      label: "500 · response đã gửi",
      cause: "Chương trình cố forward sau khi response đã commit.",
      log: "HTTP/1.1 500 Internal Server Error\nCaused by: java.lang.IllegalStateException:\nCannot forward after response has been committed",
      vars: {
        response: "đã commit",
        vấn_đề: "forward hoặc ghi thêm sau khi xử lý hoàn tất",
      },
      code: 'String url = "login.jsp";\ntry {\n    // Chọn đích, không flush response tại đây.\n    // url = ...;\n} finally {\n    request.getRequestDispatcher(url).forward(request, response);\n}\n// Không tiếp tục forward hoặc ghi body sau khi hoàn tất.',
      fix: "Tập trung chuyển tiếp cuối ở một chỗ. Chuỗi forward MainController → LoginController → JSP vẫn hợp lệ khi response chưa commit.",
      focus: "getRequestDispatcher",
    },
    sql: {
      label: "UPDATE · sai thứ tự dấu hỏi",
      cause:
        "Tham số gắn nhầm vị trí có thể gây sai dữ liệu mà không có ngoại lệ.",
      log: "HTTP/1.1 200 OK\nexecuteUpdate() = 0\nSQL: UPDATE tblUsers SET fullName = ?, roleID = ? WHERE userID = ?",
      vars: {
        "[1] đúng": "fullName",
        "[2] đúng": "roleID",
        "[3] đúng": "userID",
      },
      code: 'String sql = "UPDATE tblUsers SET fullName = ?, roleID = ? WHERE userID = ?";\nst.setString(1, u.getFullName());\nst.setString(2, u.getRoleID());\nst.setString(3, u.getUserID());\nboolean done = st.executeUpdate() > 0;',
      fix: "Đếm vị trí ? từ trái sang phải. Mã tài khoản nằm ở WHERE nên là tham số cuối, sau fullName và roleID.",
      focus: "st.setString(3",
    },
    connection: {
      label: "JDBC · không kết nối SQL",
      cause: "Kết nối TCP không tới SQL Server hoặc sai thông tin đăng nhập.",
      log: "HTTP/1.1 500 Internal Server Error\nCaused by: com.microsoft.sqlserver.jdbc.SQLServerException\nThe TCP/IP connection to host localhost, port 1433 has failed.",
      vars: {
        host: "localhost",
        port: "1433",
        "kiểm tra": "dịch vụ, TCP/IP, cổng thực tế",
      },
      code: 'String url = "jdbc:sqlserver://localhost:1433"\n           + ";databaseName=PRJ301Demo";\nConnection cn = DriverManager.getConnection(url, "sa", "MAT_KHAU_SQL_CUA_BAN");',
      fix: "Kiểm tra dịch vụ SQL Server, bật TCP/IP và cổng của instance rồi restart. Nếu thông báo là Login failed, kiểm tra tài khoản, mật khẩu và chế độ xác thực.",
      focus: "DriverManager.getConnection",
    },
  };
  function buildDebug(c) {
    const d = DEBUG_CASES[c.issue] || DEBUG_CASES["404"];
    return {
      nodes: [
        node("network", "F12 · Network", "Request / status"),
        node("output", "NetBeans Output", "Caused by"),
        node("debug", "Breakpoint", "Giá trị biến"),
        node("fix", "Kiểm chứng", "Code hoặc SQL"),
      ],
      edges: [
        ["network", "output"],
        ["output", "debug"],
        ["debug", "fix"],
      ],
      files: [
        file("Dấu vết lỗi", d.log, "Dữ liệu mô phỏng"),
        file("Code đối chiếu", d.code),
      ],
      steps: [
        step(
          "1. Xem request và mã HTTP",
          "Mở F12 > Network, thao tác lại rồi chọn request. Xem URL, method, status và dữ liệu gửi lên; không suy đoán chỉ từ giao diện trống.",
          "network",
          "Dấu vết lỗi",
          "HTTP/",
          { "tình huống": d.label, "quan sát": d.log.split("\n")[0] },
        ),
        step(
          "2. Đọc nguyên nhân trong Output",
          d.cause +
            " Với ngoại lệ, tìm Caused by và dòng stack trace có lớp của bạn. Nếu không có ngoại lệ, tiếp tục quan sát dữ liệu.",
          "output",
          "Dấu vết lỗi",
          d.log.includes("Caused by") ? "Caused by" : d.log.split("\n")[1],
          { "nguyên nhân": d.cause },
          "network",
        ),
        step(
          "3. Dừng tại breakpoint",
          "Đặt breakpoint ở lề số dòng trong NetBeans và chạy Debug. Quan sát tham số, biến url, kết quả DAO và từng giá trị trước khi chạy tiếp.",
          "debug",
          "Code đối chiếu",
          d.focus,
          d.vars,
          "output",
        ),
        step(
          "4. Sửa đúng nguyên nhân rồi chạy lại",
          d.fix +
            " Nếu liên quan truy vấn, thử câu SQL với dữ liệu mẫu trong SSMS để tách lỗi SQL khỏi lỗi Java.",
          "fix",
          "Code đối chiếu",
          d.focus,
          { "cách xử lý": d.fix, "tự kiểm": "lặp lại đúng thao tác gây lỗi" },
          "debug",
        ),
      ],
    };
  }

  const LESSONS = [
    {
      id: "environment",
      group: "Nền tảng",
      title: "Môi trường NetBeans",
      short: "Môi trường NetBeans",
      slides: "6–12",
      summary:
        "Biết từng công cụ làm gì và nối NetBeans, Tomcat, JDBC với SQL Server như thế nào.",
      fields: [],
      build: buildEnvironment,
      help: "Các phiên bản trong bài là cấu hình lớp học trong slide, không phải đề xuất phiên bản mới nhất.",
      notes: [
        [
          "Năm thành phần, năm vai trò",
          "JDK biên dịch/chạy Java; NetBeans là IDE; Tomcat thực thi Servlet/JSP; SQL Server giữ dữ liệu; driver JDBC giúp Java giao tiếp với SQL Server.",
        ],
        [
          "Hai cổng khác nhau",
          "8080 là cổng HTTP của Tomcat trong ví dụ. 1433 là cổng TCP SQL Server được cấu hình trong bài. Dấu phẩy dùng trong server name của SSMS; URL JDBC dùng dấu hai chấm.",
        ],
        [
          "Cấu trúc project Ant",
          "Java nằm trong Source Packages. HTML/JSP nằm trong Web Pages. Các gói controller, dao, dto, utils tách trách nhiệm. JAR tham chiếu trong Libraries.",
        ],
      ],
      practice: [
        "Tools > Java Platforms: thêm JDK cho project. Project Properties > Libraries: chọn Java Platform tương ứng.",
        "Tools > Servers > Add Server: ghép thư mục Tomcat 9. Trong Services > Servers, khởi động và xem Output.",
        "Tạo Web Application bằng Java with Ant, chạy F6 để kiểm tra trang đầu.",
        "Thêm JAR theo đường dẫn tương đối; tạo database rồi chỉnh URL và mật khẩu trong DBUtils.",
      ],
      caution:
        "Phân biệt hai JDK: NetBeans 13 cần JDK 11+ để chạy IDE; project có thể dùng JDK 8 theo bài. Tomcat 10 đổi javax.servlet thành jakarta.servlet, nên code trong slide cần Tomcat 9 hoặc phải được chuyển đổi.",
      references: ["netbeans", "tomcat"],
      supplement:
        "Phần JDK chạy IDE được đối chiếu tài liệu Apache, sửa cách diễn đạt dễ gây nhầm ở slide 6–7. Không có kết nối thật tới máy SQL của bạn.",
    },
    {
      id: "http",
      group: "Nền tảng",
      title: "HTTP: GET và POST",
      short: "HTTP · GET / POST",
      slides: "14–20",
      summary:
        "Đổi phương thức gửi và xem tham số nằm trong URL hay phần thân request.",
      fields: [
        field("method", "Phương thức", "GET", [
          option("GET", "GET · đọc dữ liệu"),
          option("POST", "POST · gửi form"),
        ]),
        field("name", "Giá trị name", "Nguyên"),
      ],
      build: buildHttp,
      help: "URL, headers và body bên dưới là dữ liệu mô phỏng, không tạo yêu cầu HTTP thật.",
      notes: [
        [
          "Client và server",
          "Trình duyệt chạy HTML/CSS/JavaScript. Java Servlet và JSP được thực thi trong Tomcat. Các kiểm tra quyết định ở server phải được thực hiện dù form có required.",
        ],
        [
          "GET và POST",
          "GET phù hợp thao tác đọc như tìm kiếm. POST phù hợp việc gửi thông tin đăng nhập và thao tác ghi theo quy ước của bài. POST không mã hóa dữ liệu; HTTPS mới bảo vệ dữ liệu khi truyền. Cả hai đều có giới hạn thực tế tùy cấu hình.",
        ],
        [
          "Đọc mã trạng thái",
          "200: thành công ở mức HTTP. 404: không tìm thấy tài nguyên. 405: không hỗ trợ phương thức. 500: lỗi máy chủ. Dùng status để chọn hướng điều tra, không xem nó là chẩn đoán duy nhất.",
        ],
      ],
      practice: [
        "Mở form HelloServlet, đổi method giữa GET và POST.",
        "Bấm F12 > Network, gửi form, chọn dòng request và quan sát Query String Parameters hoặc Form Data.",
        "Đối chiếu method với doGet/doPost trong Servlet.",
        'Thử tên tham số khác name để nhìn thấy getParameter("name") trả null trong Debug.',
      ],
      caution:
        'Ô type="password" chỉ che chữ trên màn hình. Dữ liệu POST vẫn xem được ở Network và vẫn cần HTTPS khi truyền thông tin nhạy cảm.',
      references: ["servlet", "request"],
      supplement:
        "Bảng so sánh được diễn đạt lại: không có phương thức nào thật sự không giới hạn dung lượng. Các HTTP message lược bỏ header không cần cho bài học.",
    },
    {
      id: "servlet",
      group: "Servlet",
      title: "Servlet đầu tiên",
      short: "Servlet đầu tiên",
      slides: "22–23",
      summary:
        "Theo một cái tên từ form, qua từng dòng HelloServlet, đến lời chào trong JSP.",
      fields: [
        field("name", "Tên gửi lên form", "Nguyên"),
        field("method", "Phương thức", "POST", [
          option("POST", "POST"),
          option("GET", "GET"),
        ]),
      ],
      build: buildServlet,
      help: "Nhập tên, bấm Áp dụng dữ liệu rồi Chạy luồng. Dòng code sáng lên theo đúng bước đang xem.",
      notes: [
        [
          "@WebServlet và extends HttpServlet",
          "Annotation đăng ký đường dẫn. Kế thừa HttpServlet cho lớp khả năng xử lý HTTP. Container gọi service rồi chọn doGet hoặc doPost.",
        ],
        [
          "Tham số, biến Java, thuộc tính",
          "name của input tạo tham số HTTP. String name là biến cục bộ chứa giá trị đọc được. MESSAGE là thuộc tính Servlet gắn vào request để JSP dùng. Ba thứ có thể liên quan nhưng không phải một khái niệm.",
        ],
        [
          "processRequest là hàm của lớp này",
          "Tên hàm không phải quy tắc đặc biệt của Servlet API. Code doGet/doPost trong slide chủ động gọi hàm chung này. Bạn vẫn có thể viết nghiệp vụ trực tiếp trong doGet hoặc doPost.",
        ],
        [
          "JSP và EL",
          "${requestScope.MESSAGE} đọc thuộc tính MESSAGE từ request. Với đối tượng DTO, ${u.fullName} dựa vào getter theo quy ước JavaBean.",
        ],
      ],
      practice: [
        "Trong Web Pages, tạo index.html và hello.jsp.",
        "Trong Source Packages > controller, tạo HelloServlet.",
        'Đối chiếu name="name", getParameter("name") và thuộc tính MESSAGE ở cả Servlet lẫn JSP.',
        "Đặt breakpoint tại getParameter; chạy Debug và quan sát name, request trước và sau setAttribute.",
      ],
      caution:
        'Đặt setCharacterEncoding trước khi đọc tham số POST. Với tham số GET trên URL, kiểm tra cả URIEncoding của Tomcat. Ví dụ giữ nguyên chuỗi "Xin chao " như trong slide.',
      references: ["servlet", "request", "forward"],
      supplement:
        "Bổ sung import cần thiết, cấu trúc HTML và trường value để bạn nhìn thấy dữ liệu đang thử. Thứ tự các lệnh nghiệp vụ giữ theo slide.",
    },
    {
      id: "lifecycle",
      group: "Servlet",
      title: "Vòng đời của Servlet",
      short: "Vòng đời Servlet",
      slides: "20–21, 28",
      summary:
        "Quan sát một instance được khởi tạo, nhận nhiều request rồi ngừng phục vụ.",
      fields: [],
      build: buildLifecycle,
      help: "Các bộ đếm minh họa một instance Servlet trong một lần triển khai ứng dụng.",
      notes: [
        [
          "init → service → destroy",
          "init chạy một lần khi instance được khởi tạo thành công. service chạy mỗi lần xử lý request. destroy dọn tài nguyên khi container đưa instance ra khỏi phục vụ theo vòng đời bình thường.",
        ],
        [
          "Dùng lại đối tượng",
          "Một instance thường phục vụ nhiều request đồng thời. Nếu đặt userID riêng của khách vào biến instance, dữ liệu giữa các request có thể bị ghi đè.",
        ],
        [
          "Chọn nơi đặt biến",
          "Dùng biến cục bộ trong phương thức cho dữ liệu một lần xử lý. Dùng session cho dữ liệu theo phiên. Hằng số cấu hình bất biến có thể nằm ở mức lớp.",
        ],
      ],
      practice: [
        "Tạo Servlet minh họa và override init, doGet, destroy.",
        "Thêm log trong ba phương thức, chạy project rồi tải trang nhiều lần.",
        "Quan sát init không lặp lại sau mỗi lần refresh.",
        "Dừng hoặc redeploy ứng dụng và đối chiếu log vòng đời.",
      ],
      caution:
        "“Một lần” ở đây tính trên một instance, không phải một lần mãi mãi. Redeploy, cấu hình nhiều instance hoặc nhiều máy chủ có thể tạo instance khác. Dừng tiến trình đột ngột không bảo đảm chạy destroy.",
      references: ["servlet"],
      supplement:
        "Hai request R1/R2 và các bộ đếm được thêm để làm rõ sơ đồ vòng đời ở slide 21.",
    },
    {
      id: "dispatch",
      group: "Servlet",
      title: "forward và sendRedirect",
      short: "Forward / Redirect",
      slides: "24",
      summary:
        "Đổi cách chuyển trang để thấy request được giữ hay tạo mới, và URL thay đổi ra sao.",
      fields: [
        field("mode", "Cách chuyển trang", "forward", [
          option("forward", "forward · chuyển nội bộ"),
          option("redirect", "sendRedirect · request mới"),
        ]),
      ],
      build: buildDispatch,
      help: "Theo dõi request ID R1/R2, thuộc tính MESSAGE và thanh địa chỉ ở từng bước.",
      notes: [
        [
          "forward",
          "Máy chủ chuyển request tới một tài nguyên nội bộ. Các thuộc tính như MESSAGE còn để trang JSP đích sử dụng. Địa chỉ trình duyệt giữ nguyên.",
        ],
        [
          "sendRedirect",
          "Máy chủ trả chỉ thị chuyển hướng; trình duyệt thực hiện request mới. Thuộc tính request cũ không tự chuyển sang request mới, nhưng session hợp lệ có thể còn.",
        ],
        [
          "Thời điểm chuyển tiếp",
          "forward cần diễn ra khi response chưa commit. sendRedirect không tự return khỏi phương thức; thêm return khi phần dưới không được chạy tiếp.",
        ],
      ],
      practice: [
        'Giữ setAttribute("MESSAGE", ...), thử forward và xem lời chào trong JSP.',
        "Đổi sang sendRedirect, quan sát URL và MESSAGE.",
        "Mở Network để đếm request: mô phỏng forward có một request HTTP, redirect có hai.",
        "Đặt breakpoint sau sendRedirect để thấy vì sao đôi khi cần return.",
      ],
      caution:
        "“Mất dữ liệu request” nghĩa là trang đích nhận request mới không có thuộc tính cũ. Nó không có nghĩa session tự bị hủy. Ví dụ đếm một lần chuyển hướng, không có chuỗi redirect phụ.",
      references: ["forward", "request"],
      supplement:
        "Dùng MESSAGE để thống nhất với HelloServlet, tương đương minh họa LIST ở slide 24.",
    },
    {
      id: "scopes",
      group: "Servlet",
      title: "Request, session và đăng xuất",
      short: "Scope · Session · Logout",
      slides: "25–27, 58–59",
      summary:
        "Nhìn dữ liệu sống qua nhiều request và biến mất khi phiên đăng nhập bị hủy.",
      fields: [],
      build: buildScopes,
      help: "R1, R2, R3 là các request khác nhau; S-A là phiên được giữ giữa những request hợp lệ.",
      notes: [
        [
          "Request scope",
          "Phù hợp ERROR, LIST_USER và dữ liệu phục vụ lần trả trang hiện tại. forward cho tài nguyên đích đọc cùng request.",
        ],
        [
          "Session scope",
          "LOGIN_USER tồn tại qua nhiều request của cùng phiên, cho đến khi hết hạn hoặc bị invalidate. getSession(false) trả null khi chưa có phiên, không tạo thêm.",
        ],
        [
          "Application scope",
          "ServletContext dùng chung trong một web application; thích hợp dữ liệu chung như tên ứng dụng. Không lưu danh tính riêng của một người vào đây.",
        ],
        [
          "Lớp bảo vệ",
          "Kiểm tra session ở trang JSP được bảo vệ và ở controller chức năng. EL sessionScope.LOGIN_USER.fullName dùng getter của DTO để hiển thị họ tên.",
        ],
      ],
      practice: [
        "Đăng nhập đúng, kiểm tra LOGIN_USER trong session.",
        "Bấm Logout, gọi getSession(false), invalidate rồi sendRedirect về login.jsp.",
        "Sau logout, gõ trực tiếp welcome.jsp và thử truy cập một controller cần đăng nhập.",
        "Quan sát session-timeout trong web.xml: giá trị tính theo phút; không mặc định mọi ứng dụng đều có cùng thời hạn.",
      ],
      caution:
        "Redirect không tự bảo đảm nút Back xóa trang trong bộ nhớ đệm. Ví dụ welcome.jsp thêm Cache-Control: no-store; kiểm tra session ở server vẫn là lớp quyết định việc cho phép truy cập.",
      references: ["servlet", "request"],
      supplement:
        "Application APP_NAME, các request liên tiếp và header no-store là phần bổ sung để giải thích phạm vi và hành vi đăng xuất rõ hơn slide.",
    },
    {
      id: "jdbc",
      group: "Dữ liệu",
      title: "JDBC và con trỏ ResultSet",
      short: "JDBC · ResultSet",
      slides: "30–32, 35–40",
      summary:
        "Đi qua kết nối, dấu hỏi, các dòng kết quả và việc đóng tài nguyên.",
      fields: [field("keyword", "Tìm họ tên chứa", "")],
      build: buildJdbc,
      help: "Để trống để đọc cả hai dòng. Thử “Mai” hoặc từ không có trong bảng để quan sát số lần next().",
      notes: [
        [
          "Năm bước JDBC",
          "Nạp driver, mở Connection, chuẩn bị PreparedStatement, chạy câu lệnh và đóng tài nguyên. DBUtils gom cấu hình kết nối vào một lớp.",
        ],
        [
          "Con trỏ ResultSet",
          "Ban đầu con trỏ đứng trước dòng đầu. next() trả true khi đến được một dòng hợp lệ. Dùng while để đọc danh sách; if thường đủ khi chỉ cần một bản ghi.",
        ],
        [
          "executeQuery và executeUpdate",
          "SELECT dùng executeQuery để lấy ResultSet. INSERT/UPDATE/DELETE dùng executeUpdate, nhận số dòng tác động; trong bài thường kiểm tra > 0.",
        ],
        [
          "Đóng tài nguyên",
          "Đóng ResultSet rồi statement rồi connection. finally vẫn chạy khi có ngoại lệ. Có thể dùng try-with-resources từ Java 7 để tự quản lý tài nguyên.",
        ],
      ],
      practice: [
        "Viết DBUtils trước rồi kiểm tra kết nối từ Java.",
        "Tạo phương thức search trong UserDAO, khai danh sách rỗng trước truy vấn.",
        "Đặt breakpoint tại rs.next(), bước qua từng dòng và xem list.size().",
        "Đảm bảo việc đóng tài nguyên có trên cả đường thành công lẫn đường có ngoại lệ.",
      ],
      caution:
        "Kết quả mô phỏng dùng tìm chuỗi con không phân biệt hoa/thường. Nó không mô phỏng đầy đủ wildcard LIKE hay collation của SQL Server. Khối đóng tài nguyên đã được gia cố so với mẫu finally tuần tự trong slide.",
      references: ["prepared", "resources"],
      supplement:
        "Các từ khóa và bảng kết quả là mô phỏng với hai tài khoản trong slide 38. JDBC 4 có cơ chế tự nạp driver phù hợp; Class.forName được giữ để theo khuôn bài học.",
    },
    {
      id: "prepared",
      group: "Dữ liệu",
      title: "Vì sao phải dùng dấu hỏi?",
      short: "PreparedStatement",
      slides: "33–34",
      summary:
        "So sánh ghép chuỗi SQL với gắn tham số bằng cùng một giá trị mật khẩu.",
      fields: [
        field("mode", "Cách tạo câu lệnh", "prepared", [
          option("prepared", "PreparedStatement · dấu hỏi"),
          option("concat", "Statement · ghép chuỗi sai"),
        ]),
        field("password", "Mật khẩu minh họa", "' OR '1'='1"),
      ],
      build: buildPrepared,
      help: "Giữ chuỗi có dấu nháy để so sánh hai cách. Đổi mật khẩu thành 123456 để quan sát trường hợp đúng.",
      notes: [
        [
          "Cấu trúc khác dữ liệu",
          "PreparedStatement dùng ? cho vị trí dữ liệu. setString(1, ...) gắn một giá trị vào vị trí đầu tiên; không tự nối giá trị vào cú pháp SQL.",
        ],
        [
          "Điều gì sai khi ghép chuỗi?",
          "Trong ví dụ PowerPoint, mật khẩu có dấu nháy thoát khỏi chuỗi rồi thêm OR với điều kiện đúng. Điều kiện WHERE vì thế không còn đúng ý định ban đầu.",
        ],
        [
          "Áp dụng cho tìm kiếm",
          'Với LIKE, nối % vào giá trị trong setString(1, "%" + keyword + "%"). Giữ câu lệnh SQL có dấu hỏi.',
        ],
      ],
      practice: [
        "Trong DAO, khai SQL thành hằng số có ?.",
        "Đếm số dấu hỏi rồi đặt đúng từng setString/setBoolean.",
        "Thử giá trị mẫu trong phòng học, quan sát code và điều kiện đã thay đổi thế nào khi ghép chuỗi.",
        "Giữ PreparedStatement cho đăng nhập, tìm kiếm và mọi thao tác ghi có dữ liệu đầu vào.",
      ],
      caution:
        "Bộ mô phỏng chỉ minh họa dữ liệu và chuỗi tấn công cụ thể trong slide, không phân tích hoặc thực thi SQL tùy ý. Mật khẩu văn bản thuần thuộc ví dụ lớp học; hệ thống thực tế cần lưu mật khẩu bằng cơ chế băm phù hợp.",
      references: ["prepared"],
      supplement:
        "Dữ liệu mẫu của slide 38 được dùng để làm rõ số dòng trả về. Không có truy vấn gửi đến hệ thống nào.",
    },
    {
      id: "mvc",
      group: "Kết nối các phần",
      title: "MVC2: ai làm việc gì?",
      short: "MVC2 · DAO · DTO",
      slides: "42–52",
      summary:
        "Theo request qua MainController, controller chức năng, Model và View.",
      fields: [
        field("action", "Tham số action", "Search", [
          option("Search", "Search · tìm người dùng"),
          option("none", "Không có action"),
          option("Unknown", "Action không khớp"),
        ]),
      ],
      build: buildMvc,
      help: "Tình huống Search bắt đầu với phiên admin hợp lệ. Đổi action để nhìn nhánh quay về login.jsp.",
      notes: [
        [
          "Controller",
          "MainController đọc action và chọn controller chức năng. Controller chức năng kiểm tra phiên, đầu vào, gọi DAO, đặt dữ liệu rồi chọn View.",
        ],
        [
          "Model: DAO và DTO",
          "DAO chứa SQL và logic truy cập dữ liệu. DTO có trường private, constructor và getter/setter, dùng để mang dữ liệu giữa các tầng. SQL không đặt trong DTO.",
        ],
        [
          "View: JSP",
          "JSP nhận request/session và tạo HTML. JSTL c:forEach lặp danh sách; EL đọc thuộc tính qua getter. JSP không cần giữ Connection hay tự viết truy vấn.",
        ],
        [
          "Quy ước của project trong slide",
          "Các gói controller, dao, dto, utils có trách nhiệm riêng. Mọi form/liên kết chức năng đi qua MainController; action là tham số HTTP.",
        ],
      ],
      practice: [
        "Tạo bốn package controller, dao, dto, utils trong Source Packages.",
        "Tạo MainController, khai trong WEB-INF/web.xml và đặt làm welcome-file.",
        "Tạo các servlet chức năng có @WebServlet; bảo đảm đường dẫn mà MainController forward tới tồn tại.",
        "Tạo JSP trong Web Pages. Thêm JSTL nếu dùng c:forEach, và kiểm tra name của form khớp getParameter.",
      ],
      caution:
        "Tên MVC1/MVC2 ở slide dùng theo quy ước môn học. Theo cách gọi web Model 1/Model 2 phổ biến, Model 1 thường lấy JSP làm trung tâm; điều quan trọng ở bài này là tuân cấu trúc MainController được yêu cầu. Tránh đăng ký trùng servlet không chủ ý, thay vì kết luận annotation và web.xml luôn tạo hai instance.",
      references: ["mvc", "servlet", "request"],
      supplement:
        "Sơ đồ làm rõ dữ liệu trả từ SQL qua DAO rồi controller trước khi đến JSP. Bổ sung nhánh CRUD vào MainController; JSP dùng c:out và trường hợp danh sách rỗng để hiển thị đầy đủ.",
    },
    {
      id: "login",
      group: "Bài thực hành",
      title: "Đăng nhập: chạy từng nhánh",
      short: "Đăng nhập",
      slides: "54–60",
      summary:
        "Từ form đến truy vấn, thông báo lỗi hoặc một phiên đăng nhập hợp lệ.",
      fields: [
        field("preset", "Tình huống mẫu", "valid", [
          option("valid", "Đúng thông tin"),
          option("wrong", "Sai mật khẩu"),
          option("empty", "Thiếu thông tin"),
          option("disabled", "Tài khoản bị khóa"),
          option("system", "Lỗi cơ sở dữ liệu"),
          option("custom", "Tự nhập"),
        ]),
        field("userID", "Tài khoản", "admin"),
        field("password", "Mật khẩu mẫu", "123456", null, "password"),
      ],
      build: buildLogin,
      help: "Mẫu: admin / 123456, user1 / 123456. locked / 123456 là tài khoản bổ sung có status = 0. Chỉ dùng dữ liệu minh họa.",
      notes: [
        [
          "Bốn nhánh nghiệp vụ",
          "Thiếu dữ liệu: chặn trước DAO. Không có tài khoản khớp: báo sai. Có tài khoản nhưng status=false: báo khóa. Hợp lệ: lưu LOGIN_USER vào session và chọn welcome.jsp.",
        ],
        [
          "Đường lỗi và đường thành công",
          "url bắt đầu là login.jsp. Nhánh thành công mới đổi sang welcome.jsp. ERROR thuộc request, LOGIN_USER thuộc session. Ngoại lệ được log và chuyển thành thông báo System error.",
        ],
        [
          "Thứ tự tám tệp",
          "DBUtils → UserDTO → UserDAO → login.jsp → MainController/web.xml → LoginController → welcome.jsp/LogoutController. Viết từ phần được gọi lên phần gọi nó để dễ kiểm tra.",
        ],
      ],
      practice: [
        "Chạy login.jsp để chắc form gửi đúng userID, password và action=Login.",
        "Đặt breakpoint tại dao.checkLogin và theo dõi DTO trả về.",
        "Thử đủ đúng, sai, rỗng, bị khóa; chú ý required của form thật có thể chặn trường hợp rỗng trước khi gửi.",
        "Sau đăng nhập, kiểm tra Welcome hiển thị họ tên, Logout hủy session và trang welcome có lớp bảo vệ.",
      ],
      caution:
        "Mô phỏng gửi tới controller ngay cả với ô rỗng để bạn đọc được nhánh kiểm tra server. Code mã Java được hiển thị để học, không phải một trình biên dịch hay bộ đăng nhập thật trên trang này.",
      references: ["request", "forward"],
      supplement:
        "Tài khoản locked và tình huống lỗi DB được thêm để quan sát đủ nhánh trong LoginController ở slide 57. Khối đóng tài nguyên trong DAO được gia cố.",
    },
    {
      id: "crud",
      group: "Bài thực hành",
      title: "CRUD và nạp lại danh sách",
      short: "Tìm · thêm · sửa · xóa",
      slides: "64–68",
      summary:
        "Đổi thao tác, theo các dấu hỏi trong SQL và quan sát bảng trước/sau xử lý.",
      fields: [
        field("operation", "Thao tác", "Search", [
          option("Search", "Tìm kiếm · SELECT"),
          option("Create", "Thêm mới · INSERT"),
          option("Update", "Cập nhật · UPDATE"),
          option("Delete", "Xóa · DELETE"),
        ]),
        field("keyword", "Từ khóa của danh sách", ""),
        {
          ...field("userID", "userID", "user2"),
          when: (c) => c.operation !== "Search",
        },
        {
          ...field("fullName", "Họ tên", "Le Minh An"),
          when: (c) => ["Create", "Update"].includes(c.operation),
        },
        {
          ...field("roleID", "Vai trò", "US", [
            option("US", "US"),
            option("AD", "AD"),
          ]),
          when: (c) => ["Create", "Update"].includes(c.operation),
        },
        {
          ...field("confirm", "Xác nhận xóa", "yes", [
            option("yes", "Đồng ý xóa"),
            option("no", "Hủy thao tác"),
          ]),
          when: (c) => c.operation === "Delete",
        },
      ],
      build: buildCrud,
      help: "Mỗi lần áp dụng dùng lại hai dòng admin/user1 ban đầu. Thử thêm trùng ID, sửa ID không tồn tại hoặc hủy xóa. Mật khẩu tài khoản thêm là 123456 trong ví dụ.",
      notes: [
        [
          "Tìm kiếm",
          "SELECT dùng LIKE ? và setString với %keyword%. DAO trả List<UserDTO>; controller đặt LIST_USER và keyword vào request trước khi chuyển JSP.",
        ],
        [
          "Thêm và sửa",
          "INSERT kiểm tra mã chưa tồn tại. UPDATE có thứ tự fullName, roleID, userID: ID ở điều kiện WHERE nên là tham số cuối. Bảng có khóa chính để bảo vệ tính duy nhất.",
        ],
        [
          "Xóa và kết quả lệnh ghi",
          "Hỏi xác nhận trước khi gửi yêu cầu xóa. executeUpdate trả số dòng tác động; bằng 0 nghĩa là không có bản ghi bị ảnh hưởng trong ví dụ.",
        ],
        [
          "Nạp lại dữ liệu",
          "Sau Create/Update/Delete, đi qua SearchController để đọc bảng mới, rồi mới hiển thị JSP. Phần nâng cao trong slide: chỉ AD được xóa, không tự xóa chính mình, lọc vai trò và phân trang.",
        ],
      ],
      practice: [
        "Thêm action Create/Update/Delete vào MainController và tạo servlet chức năng tương ứng.",
        "Thêm phương thức vào DAO, giữ SQL có dấu hỏi; xử lý lỗi trùng khóa từ DB ngay cả khi đã kiểm tra trước.",
        "Edit cần nạp dữ liệu bản ghi lên form trước khi người dùng lưu. Thực hiện kiểm tra quyền ở server.",
        "Sau lệnh ghi, trở lại SearchController. Thử từ khóa rỗng, không tìm thấy và kiểm tra bảng được nạp lại.",
      ],
      caution:
        "Đoạn controller CRUD là trích đoạn: các biến userID/user phải được tạo từ dữ liệu đã kiểm tra. Phần phân quyền nâng cao và phân trang được nêu để đối chiếu bài tập, chưa được mô phỏng. Tìm kiếm mô phỏng là chuỗi con, không phải SQL LIKE đầy đủ.",
      references: ["prepared", "resources"],
      supplement:
        "Slide giao bài thêm mới nhưng chưa cung cấp mã INSERT; ví dụ INSERT/exists và try-with-resources được bổ sung. Bảng trước/sau là các trạng thái mô phỏng có thể quay lại bằng nút bước trước.",
    },
    {
      id: "debug",
      group: "Bài thực hành",
      title: "Gỡ lỗi theo dấu vết",
      short: "Gỡ lỗi & tự kiểm",
      slides: "12, 39, 60–62, 69–70",
      summary:
        "Chọn một lỗi và lần từ Network đến Output, breakpoint và cách kiểm chứng.",
      fields: [
        field(
          "issue",
          "Tình huống cần dò",
          "404",
          Object.entries(DEBUG_CASES).map(([value, d]) =>
            option(value, d.label),
          ),
        ),
      ],
      build: buildDebug,
      help: "Mỗi log là một ví dụ để tập đọc; trong project thật hãy đối chiếu chính request và stack trace của bạn.",
      notes: [
        [
          "HTTP trước, suy đoán sau",
          "Xem URL, method, payload và status trong Network. 200 vẫn có thể đi kèm lỗi nghiệp vụ; 500 cần đọc nguyên nhân bên máy chủ.",
        ],
        [
          "Đọc Output",
          "Tìm Caused by và dòng stack trace thuộc lớp của mình. Sai tên database, tên bảng/cột, driver, tài khoản hoặc TCP/IP cần cách xử lý khác nhau.",
        ],
        [
          "Theo dõi biến",
          "Đặt breakpoint trước getParameter, trước DAO và trước forward. So tên tham số/thuộc tính, giá trị url và số dòng tác động.",
        ],
        [
          "Sáu ca kiểm tra trong slide",
          "Mở gốc ứng dụng; gửi rỗng; gửi sai mật khẩu; gửi đúng; logout rồi truy cập lại; gõ thẳng welcome.jsp khi chưa đăng nhập. Thêm ca khóa tài khoản để phủ nhánh status.",
        ],
      ],
      practice: [
        "Chạy Debug Project, đặt breakpoint tại dòng nghi ngờ và xem Variables.",
        "Bấm Step Over để đi qua từng lệnh; Step Into khi cần đi vào phương thức DAO.",
        "Với SQL, đối chiếu câu lệnh và từng tham số bằng dữ liệu mẫu trong SSMS.",
        "Chạy lại đúng ca lỗi sau khi sửa rồi thực hiện các ca tự kiểm dưới đây.",
      ],
      caution:
        "Hai lần forward theo các tầng MainController → LoginController → JSP có thể hoàn toàn hợp lệ. Lỗi committed liên quan thời điểm response đã gửi, không chỉ là đếm số chữ forward trong project.",
      references: ["forward"],
      supplement:
        "Các log lỗi và code sửa là ví dụ biên soạn theo bảng lỗi trong slide; chúng không được thu từ máy của bạn.",
      checks: [
        "Mở URL gốc hiện login.jsp",
        "Thiếu thông tin được chặn ở server",
        "Sai mật khẩu hiện thông báo đúng",
        "Đúng thông tin hiện Welcome kèm họ tên",
        "Logout hủy phiên, chức năng cần đăng nhập bị chặn",
        "Truy cập thẳng welcome.jsp khi chưa đăng nhập bị chuyển về login.jsp",
      ],
    },
  ];

  // Cho phép kiểm tra dữ liệu bài học bằng Node; không ảnh hưởng khi mở trong browser.
  if (typeof module !== "undefined" && module.exports)
    module.exports = { LESSONS, BASE_USERS, DEMO_USERS };
  if (typeof document === "undefined") return;

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, text) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lesson = LESSONS[2],
    config = {},
    model = null,
    currentStep = 0,
    selectedFile = "",
    playing = false,
    timer = null,
    toastTimer = null;

  function stopPlayback() {
    playing = false;
    window.clearTimeout(timer);
    timer = null;
    const svg = $("flow-diagram").querySelector("svg");
    if (svg && svg.pauseAnimations) svg.pauseAnimations();
    updatePlayback();
  }
  function schedule() {
    window.clearTimeout(timer);
    if (!playing) return;
    timer = window.setTimeout(
      () => {
        if (currentStep < model.steps.length - 1) {
          currentStep++;
          selectedFile = model.steps[currentStep].file;
          renderStep();
          schedule();
        } else stopPlayback();
      },
      Number($("play-speed").value),
    );
  }
  function play() {
    if (currentStep === model.steps.length - 1) {
      currentStep = 0;
      selectedFile = model.steps[0].file;
      renderStep();
    }
    playing = true;
    const svg = $("flow-diagram").querySelector("svg");
    if (svg && svg.unpauseAnimations) svg.unpauseAnimations();
    updatePlayback();
    schedule();
  }
  function updatePlayback() {
    if (!model) return;
    $("play-toggle").textContent = playing
      ? "Ⅱ Tạm dừng"
      : currentStep === model.steps.length - 1
        ? "↻ Chạy lại"
        : "▶ Chạy luồng";
    $("prev-step").disabled = currentStep === 0;
    $("next-step").disabled = currentStep === model.steps.length - 1;
  }
  function goStep(index) {
    stopPlayback();
    currentStep = Math.max(0, Math.min(model.steps.length - 1, index));
    selectedFile = model.steps[currentStep].file;
    renderStep();
  }

  function renderNav() {
    const nav = $("lesson-nav");
    nav.replaceChildren();
    let group = "";
    LESSONS.forEach((item, i) => {
      if (group !== item.group) {
        nav.append(el("div", "nav-group", item.group));
        group = item.group;
      }
      const a = el("a", "lesson-link");
      a.href = "#" + item.id;
      a.dataset.lesson = item.id;
      if (item.id === lesson.id) a.setAttribute("aria-current", "page");
      a.append(
        el("span", "nav-num", String(i + 1).padStart(2, "0")),
        el("span", "", item.short),
      );
      nav.append(a);
    });
  }
  function defaults(item) {
    return Object.fromEntries(item.fields.map((f) => [f.key, f.value]));
  }
  function readConfig() {
    const output = { ...config };
    new FormData($("scenario-form")).forEach((value, key) => {
      output[key] = String(value);
    });
    return output;
  }
  function renderFields() {
    const parent = $("scenario-fields");
    parent.replaceChildren();
    $("scenario-form").hidden = lesson.fields.length === 0;
    lesson.fields.forEach((f) => {
      if (f.when && !f.when(config)) return;
      const label = el("label", "field", f.label);
      let input;
      if (f.options) {
        input = el("select");
        f.options.forEach((o) => {
          const choice = el("option", "", o.label);
          choice.value = o.value;
          input.append(choice);
        });
      } else {
        input = el("input");
        input.type = f.type;
        input.maxLength =
          f.key === "userID" ? 20 : f.key === "fullName" ? 100 : 120;
        input.autocomplete = "off";
        input.spellcheck = false;
      }
      input.name = f.key;
      input.id = "scenario-" + f.key;
      input.value = config[f.key] === undefined ? f.value : config[f.key];
      label.append(input);
      parent.append(label);
    });
  }
  function renderNotes() {
    const notes = $("concept-notes");
    notes.replaceChildren();
    lesson.notes.forEach(([title, text]) => {
      const article = el("div", "concept-item");
      article.append(el("h3", "", title), el("p", "", text));
      notes.append(article);
    });
    const practice = $("netbeans-steps");
    practice.replaceChildren();
    lesson.practice.forEach((text) => practice.append(el("li", "", text)));
    if (lesson.checks) {
      const checks = el("div", "check-grid");
      lesson.checks.forEach((text) => {
        const label = el("label", "check-row");
        const input = el("input");
        input.type = "checkbox";
        label.append(input, el("span", "", text));
        checks.append(label);
      });
      practice.after(checks);
    }
    $("lesson-caution").textContent = lesson.caution;
    const source = $("source-detail-content");
    source.replaceChildren();
    source.append(
      el(
        "p",
        "",
        "Nguồn chính: PRJ301_Tuan1_2.pptx, slide " +
          lesson.slides +
          ". Số slide tính theo thứ tự 70 slide trong tệp, bao gồm slide mở đầu; không phải số nhỏ in ở góc từng trang.",
      ),
    );
    source.append(el("p", "", lesson.supplement));
    if (lesson.references.length) {
      const ul = el("ul");
      lesson.references.forEach((id) => {
        const li = el("li");
        const [title, url] = sources[id];
        const link = el("a", "", title);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        li.append(link);
        ul.append(li);
      });
      source.append(
        el("p", "", "Tài liệu chính thức để đối chiếu phần giải thích:"),
        ul,
      );
    }
    source.append(
      el(
        "p",
        "",
        "Dữ liệu này là mô hình học tập có thể tua lại. Các đoạn ghi “trích đoạn” cần đặt vào đúng lớp/phương thức và thêm import nếu dùng để thực hành Java. Trang web không thực thi những đoạn mã đó.",
      ),
    );
  }
  function openLesson(id, scroll = false) {
    stopPlayback();
    lesson = LESSONS.find((l) => l.id === id) || LESSONS[2];
    config = defaults(lesson);
    currentStep = 0;
    document.querySelectorAll(".check-grid").forEach((e) => e.remove());
    const index = LESSONS.indexOf(lesson);
    $("lesson-title").textContent = lesson.title;
    $("breadcrumb-title").textContent = lesson.short;
    $("lesson-number").textContent =
      "BÀI " + String(index + 1).padStart(2, "0");
    $("slide-ref").textContent = "PPT · slide " + lesson.slides;
    $("lesson-summary").textContent = lesson.summary;
    $("scenario-help").textContent = lesson.help;
    $("prev-lesson").disabled = index === 0;
    $("next-lesson").disabled = index === LESSONS.length - 1;
    $("lesson-position").textContent =
      "Bài " + (index + 1) + " / " + LESSONS.length;
    document.title = lesson.title + " — JavaWeb Lab";
    renderNav();
    renderFields();
    renderNotes();
    rebuild(false);
    if (scroll)
      $("main").scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
  }
  function rebuild(read = true) {
    stopPlayback();
    if (read) config = readConfig();
    model = lesson.build(config);
    currentStep = 0;
    selectedFile = model.steps[0].file;
    renderStep();
  }
  function renderStep() {
    const item = model.steps[currentStep];
    $("step-counter").textContent =
      String(currentStep + 1).padStart(2, "0") +
      " / " +
      String(model.steps.length).padStart(2, "0");
    $("step-kicker").textContent =
      "BƯỚC " + String(currentStep + 1).padStart(2, "0");
    $("step-title").textContent = item.title;
    $("step-description").textContent = item.description;
    $("data-context").textContent = "Trạng thái mô phỏng";
    const state = $("data-state");
    state.replaceChildren();
    Object.entries(item.data).forEach(([key, value]) => {
      const row = el("div", "state-row");
      row.append(
        el("dt", "", key),
        el(
          "dd",
          /ERROR|MESSAGE|url|hiển thị|kết quả/.test(key) ? "emphasis" : "",
          String(value),
        ),
      );
      state.append(row);
    });
    renderTable(item.table);
    renderDots();
    renderCode();
    drawFlow();
    updatePlayback();
  }
  function renderTable(data) {
    const host = $("data-table");
    host.replaceChildren();
    if (!data) return;
    const wrap = el("div", "mini-table-wrap");
    const table = el("table", "mini-table");
    table.append(el("caption", "", data.caption));
    const head = el("thead");
    const tr = el("tr");
    data.headers.forEach((text) => {
      const th = el("th", "", text);
      th.scope = "col";
      tr.append(th);
    });
    head.append(tr);
    table.append(head);
    const body = el("tbody");
    data.rows.forEach((cells, i) => {
      const row = el("tr", i === data.cursor ? "current" : "");
      cells.forEach((text) => row.append(el("td", "", String(text))));
      body.append(row);
    });
    table.append(body);
    wrap.append(table);
    if (!data.rows.length)
      wrap.append(el("div", "empty-table", "Không có dòng dữ liệu."));
    host.append(wrap);
  }
  function renderDots() {
    const root = $("step-dots");
    root.replaceChildren();
    model.steps.forEach((s, i) => {
      const button = el(
        "button",
        "step-dot" + (i < currentStep ? " passed" : ""),
        String(i + 1),
      );
      button.type = "button";
      button.title = s.title;
      button.setAttribute("aria-label", "Bước " + (i + 1) + ": " + s.title);
      button.dataset.step = String(i);
      if (i === currentStep) button.setAttribute("aria-current", "step");
      root.append(button);
    });
  }

  function appendTokens(parent, text) {
    const re =
      /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*$|<%--.*?--%>|<!--.*?-->|\b(?:public|private|protected|class|extends|implements|import|package|static|final|void|String|boolean|int|return|if|else|try|catch|finally|new|null|true|false|throws|while|switch|case|break|default|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|AND|OR|LIKE|CREATE|TABLE|DATABASE|GO|USE)\b|\b\d+\b)/g;
    let last = 0;
    for (const m of text.matchAll(re)) {
      if (m.index > last)
        parent.append(document.createTextNode(text.slice(last, m.index)));
      const token = m[0];
      const cls =
        token.startsWith("//") ||
        token.startsWith("<!--") ||
        token.startsWith("<%--")
          ? "tok-comment"
          : /^["']/.test(token)
            ? "tok-string"
            : /^\d/.test(token)
              ? "tok-number"
              : "tok-keyword";
      parent.append(el("span", cls, token));
      last = m.index + token.length;
    }
    if (last < text.length)
      parent.append(document.createTextNode(text.slice(last)));
  }
  function renderCode() {
    const tabs = $("code-tabs");
    tabs.replaceChildren();
    const activeFile =
      model.files.find((f) => f.name === selectedFile) || model.files[0];
    selectedFile = activeFile.name;
    model.files.forEach((f, i) => {
      const b = el("button", "file-tab", f.name);
      b.type = "button";
      b.id = "code-tab-" + i;
      b.dataset.file = f.name;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(f.name === selectedFile));
      b.setAttribute("aria-controls", "code-scroll");
      b.tabIndex = f.name === selectedFile ? 0 : -1;
      tabs.append(b);
      if (f.name === selectedFile)
        $("code-scroll").setAttribute("aria-labelledby", b.id);
    });
    const path = activeFile.name.endsWith(".java")
      ? activeFile.name.startsWith("UserDAO")
        ? "dao/"
        : activeFile.name === "DBUtils.java"
          ? "utils/"
          : activeFile.name === "UserDTO.java"
            ? "dto/"
            : "controller/"
      : activeFile.name === "web.xml"
        ? "WEB-INF/"
        : "";
    $("code-path").textContent = path + activeFile.name;
    $("code-kind").textContent = activeFile.kind;
    const content = $("code-content");
    content.replaceChildren();
    const s = model.steps[currentStep];
    let first = -1;
    const lines = activeFile.text.split("\n");
    const scopeStart = s.within
      ? lines.findIndex((line) => line.includes(s.within))
      : -1;
    const nextMethod = s.within
      ? lines.findIndex(
          (line, i) => i > scopeStart && /^\s*(public|protected)\s/.test(line),
        )
      : -1;
    const scopeEnd = nextMethod < 0 ? lines.length : nextMethod;
    lines.forEach((line, i) => {
      const highlight =
        activeFile.name === s.file &&
        (!s.within || (i >= scopeStart && i < scopeEnd)) &&
        s.focus.some((f) => f && line.includes(f));
      if (highlight && first === -1) first = i;
      const row = el("span", "code-line" + (highlight ? " highlight" : ""));
      row.append(el("span", "line-no", String(i + 1)));
      const code = el("span", "line-text");
      appendTokens(code, line || " ");
      row.append(code);
      content.append(row);
    });
    $("code-focus-note").textContent =
      activeFile.name === s.file
        ? "Vùng sáng tương ứng với bước " + (currentStep + 1)
        : "Đang đọc tệp tham khảo · chuyển bước để trở lại code theo luồng";
    const scroller = $("code-scroll");
    if (first >= 0) {
      const line = content.children[first];
      scroller.scrollTop = Math.max(0, line.offsetTop - content.offsetTop - 80);
    } else scroller.scrollTop = 0;
  }

  function drawFlow() {
    if (!model) return;
    const host = $("flow-diagram");
    const w = Math.max(250, Math.round(host.clientWidth - 16));
    const compact = w < 475;
    const cols = compact ? 2 : 3;
    const n = model.nodes.length;
    const rows = Math.ceil(n / cols);
    const gapX = compact ? 26 : 24;
    const margin = compact ? 15 : 18;
    const bw = (w - 2 * margin - gapX * (cols - 1)) / cols;
    const bh = 72;
    const rowGap = 56;
    const h = rows * bh + (rows - 1) * rowGap + 56;
    const svg = svgEl("svg", {
      class: "flow-svg",
      viewBox: `0 0 ${w} ${h}`,
      width: w,
      height: h,
      role: "group",
      "aria-label":
        "Luồng " + lesson.title + ". " + model.steps[currentStep].description,
    });
    const defs = svgEl("defs");
    const marker = svgEl("marker", {
      id: "flow-arrow",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerWidth: "6",
      markerHeight: "6",
      orient: "auto-start-reverse",
    });
    marker.append(
      svgEl("path", {
        d: "M 1 1 L 9 5 L 1 9",
        fill: "none",
        stroke: "#97a8bd",
        "stroke-width": "1.7",
      }),
    );
    defs.append(marker);
    svg.append(defs);
    const positions = {};
    model.nodes.forEach((item, i) => {
      const row = Math.floor(i / cols),
        rcol = i % cols,
        col = row % 2 === 0 ? rcol : cols - 1 - rcol;
      positions[item.id] = {
        x: margin + col * (bw + gapX),
        y: 22 + row * (bh + rowGap),
        w: bw,
        h: bh,
      };
    });
    const s = model.steps[currentStep];
    const edges = [...model.edges];
    if (
      s.from &&
      s.from !== s.at &&
      !edges.some((e) => e[0] === s.from && e[1] === s.at)
    )
      edges.push([s.from, s.at]);
    let activePath = null;
    function connection(a, b) {
      const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 },
        bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
      if (Math.abs(ac.y - bc.y) < 3) {
        if (Math.abs(ac.x - bc.x) > bw + gapX + 4) {
          const rail = ac.y + a.h / 2 + 20;
          return `M ${ac.x} ${ac.y + a.h / 2} L ${ac.x} ${rail} L ${bc.x} ${rail} L ${bc.x} ${bc.y + b.h / 2 + 4}`;
        }
        const direction = bc.x > ac.x ? 1 : -1;
        return `M ${ac.x + (direction * a.w) / 2} ${ac.y} L ${bc.x - direction * (b.w / 2 + 4)} ${bc.y}`;
      }
      if (Math.abs(ac.x - bc.x) < 3) {
        if (Math.abs(ac.y - bc.y) > bh + rowGap + 4) {
          const rail = ac.x < w / 2 ? 5 : w - 5;
          return `M ${ac.x + (rail < ac.x ? -a.w / 2 : a.w / 2)} ${ac.y} L ${rail} ${ac.y} L ${rail} ${bc.y} L ${bc.x + (rail < bc.x ? -b.w / 2 - 4 : b.w / 2 + 4)} ${bc.y}`;
        }
        const d = bc.y > ac.y ? 1 : -1;
        return `M ${ac.x} ${ac.y + (d * a.h) / 2} L ${bc.x} ${bc.y - d * (b.h / 2 + 4)}`;
      }
      const d = bc.y > ac.y ? 1 : -1;
      const sy = ac.y + (d * a.h) / 2,
        ey = bc.y - d * (b.h / 2 + 4);
      return `M ${ac.x} ${sy} C ${ac.x} ${(sy + ey) / 2}, ${bc.x} ${(sy + ey) / 2}, ${bc.x} ${ey}`;
    }
    edges.forEach(([from, to]) => {
      if (!positions[from] || !positions[to] || from === to) return;
      const active = from === s.from && to === s.at;
      const d = connection(positions[from], positions[to]);
      const p = svgEl("path", {
        d,
        class: "flow-edge" + (active ? " active" : ""),
        "marker-end": "url(#flow-arrow)",
      });
      svg.append(p);
      if (active) activePath = d;
    });
    const measure = document.createElement("canvas").getContext("2d");
    function textWidth(text, size = 14) {
      if (!measure) return text.length * size * 0.55;
      measure.font =
        (size === 14 ? "600 " : "400 ") +
        size +
        'px "Segoe UI", Arial, sans-serif';
      return measure.measureText(text).width;
    }
    model.nodes.forEach((item) => {
      const p = positions[item.id];
      const g = svgEl("g", {
        class: "flow-node" + (s.at === item.id ? " active" : ""),
        role: "button",
        tabindex: "0",
        "aria-label":
          item.label + ": " + item.sub + ". Chọn bước có thành phần này.",
        "data-node": item.id,
      });
      g.append(
        svgEl("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: "11" }),
      );
      let titleLines = [item.label];
      if (textWidth(item.label) > p.w - 12) {
        const words = item.label.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
        titleLines = [""];
        words.forEach((word) => {
          const last = titleLines.length - 1;
          const joined = (titleLines[last] + " " + word).trim();
          if (titleLines[last] && textWidth(joined) > p.w - 12)
            titleLines.push(word);
          else titleLines[last] = joined;
        });
      }
      titleLines
        .slice(0, 2)
        .forEach((text, i) =>
          g.append(
            svgEl(
              "text",
              {
                x: p.x + p.w / 2,
                y: p.y + (titleLines.length > 1 ? 23 + i * 17 : 31),
                "text-anchor": "middle",
                class: "node-label",
              },
              text,
            ),
          ),
        );
      let sub = item.sub;
      while (sub.length > 2 && textWidth(sub, 12) > p.w - 14)
        sub = sub.slice(0, -2) + "…";
      g.append(
        svgEl(
          "text",
          {
            x: p.x + p.w / 2,
            y: p.y + (titleLines.length > 1 ? 59 : 52),
            "text-anchor": "middle",
            class: "node-sub",
          },
          sub,
        ),
      );
      svg.append(g);
    });
    if (activePath && !reducedMotion.matches) {
      const dot = svgEl("circle", {
        r: "5.5",
        fill: "#238b99",
        "aria-hidden": "true",
      });
      dot.append(
        svgEl("animateMotion", {
          dur: "0.85s",
          path: activePath,
          fill: "freeze",
          calcMode: "spline",
          keyTimes: "0;1",
          keySplines: ".4 0 .2 1",
        }),
      );
      svg.append(dot);
    }
    host.replaceChildren(svg);
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").hidden = false;
    toastTimer = window.setTimeout(() => {
      $("toast").hidden = true;
    }, 2800);
  }
  async function copyCode() {
    const f = model.files.find((x) => x.name === selectedFile);
    try {
      if (!navigator.clipboard) throw new Error("fallback");
      await navigator.clipboard.writeText(f.text);
      showToast("Đã sao chép " + f.name);
    } catch (_) {
      const ta = el("textarea");
      ta.value = f.text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (e) {
        copied = false;
      }
      ta.remove();
      if (copied) showToast("Đã sao chép " + f.name);
      else {
        const range = document.createRange();
        range.selectNodeContents($("code-content"));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showToast("Đã chọn code. Nhấn Ctrl+C để sao chép.");
      }
    }
  }
  function selectFile(name, focus = false) {
    stopPlayback();
    selectedFile = name;
    renderCode();
    if (focus)
      document.querySelector('.file-tab[aria-selected="true"]').focus();
  }
  function pickNode(id) {
    const candidates = model.steps
      .map((s, i) => (s.at === id ? i : -1))
      .filter((i) => i >= 0);
    if (!candidates.length) {
      showToast("Khối này mô tả thành phần hỗ trợ trong tình huống hiện tại.");
      return;
    }
    const next = candidates.find((i) => i > currentStep);
    goStep(next === undefined ? candidates[0] : next);
  }

  $("scenario-form").addEventListener("submit", (event) => {
    event.preventDefault();
    rebuild();
    showToast("Đã áp dụng dữ liệu. Bấm Chạy luồng để bắt đầu.");
  });
  $("scenario-form").addEventListener("change", (event) => {
    const key = event.target.name;
    const next = readConfig();
    if (lesson.id === "login" && key === "preset") {
      const presets = {
        valid: ["admin", "123456"],
        wrong: ["admin", "wrong"],
        empty: ["", ""],
        disabled: ["locked", "123456"],
        system: ["admin", "123456"],
      };
      const values = presets[next.preset];
      if (values) {
        next.userID = values[0];
        next.password = values[1];
      }
      config = next;
      renderFields();
      rebuild(false);
    } else if (
      lesson.id === "login" &&
      (key === "userID" || key === "password")
    ) {
      const picker = $("scenario-preset");
      if (picker && picker.value !== "system") picker.value = "custom";
    } else if (lesson.id === "crud" && key === "operation") {
      if (next.operation === "Create") {
        next.userID = "user2";
        next.fullName = "Le Minh An";
      } else if (next.operation === "Update") {
        next.userID = "user1";
        next.fullName = "Tran Thi Mai (updated)";
      } else if (next.operation === "Delete") {
        next.userID = "user1";
      }
      config = next;
      renderFields();
      rebuild(false);
    }
  });
  $("prev-step").addEventListener("click", () => goStep(currentStep - 1));
  $("next-step").addEventListener("click", () => goStep(currentStep + 1));
  $("reset-flow").addEventListener("click", () => goStep(0));
  $("play-toggle").addEventListener("click", () =>
    playing ? stopPlayback() : play(),
  );
  $("play-speed").addEventListener("change", () => {
    if (playing) schedule();
  });
  $("step-dots").addEventListener("click", (event) => {
    const b = event.target.closest("[data-step]");
    if (b) goStep(Number(b.dataset.step));
  });
  $("code-tabs").addEventListener("click", (event) => {
    const b = event.target.closest("[data-file]");
    if (b) selectFile(b.dataset.file);
  });
  $("code-tabs").addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const i = model.files.findIndex((f) => f.name === selectedFile);
    let j =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? model.files.length - 1
          : (i + (event.key === "ArrowRight" ? 1 : -1) + model.files.length) %
            model.files.length;
    selectFile(model.files[j].name, true);
  });
  $("flow-diagram").addEventListener("click", (event) => {
    const g = event.target.closest("[data-node]");
    if (g) pickNode(g.dataset.node);
  });
  $("flow-diagram").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      const g = event.target.closest("[data-node]");
      if (g) {
        event.preventDefault();
        pickNode(g.dataset.node);
      }
    }
  });
  $("copy-code").addEventListener("click", copyCode);
  $("prev-lesson").addEventListener("click", () => {
    const i = LESSONS.indexOf(lesson);
    if (i > 0) location.hash = LESSONS[i - 1].id;
  });
  $("next-lesson").addEventListener("click", () => {
    const i = LESSONS.indexOf(lesson);
    if (i < LESSONS.length - 1) location.hash = LESSONS[i + 1].id;
  });
  window.addEventListener("hashchange", () =>
    openLesson(location.hash.slice(1), true),
  );
  window.addEventListener("keydown", (event) => {
    if (
      event.target.closest(
        'input,select,textarea,button,a,[role="tab"],[data-node]',
      ) ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    )
      return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goStep(currentStep + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goStep(currentStep - 1);
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) stopPlayback();
  });
  reducedMotion.addEventListener("change", () => drawFlow());
  if ("ResizeObserver" in window)
    new ResizeObserver(() => drawFlow()).observe($("flow-diagram"));
  else window.addEventListener("resize", drawFlow);
  openLesson(location.hash.slice(1) || "servlet");
})();
