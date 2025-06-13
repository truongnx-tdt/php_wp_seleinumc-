using NUnit.Framework;
using SeleniumTesting.Base;
using SeleniumTesting.Pages;

namespace SeleniumTesting.TestCases
{
    public class ArticleTest : BaseTest
    {
        private LoginPage _loginPage;
        private ArticlePage _postPage;
        [SetUp]
        public void Setup()
        {
            _loginPage = new LoginPage(Driver);
            _postPage = new ArticlePage(Driver);
        }
        #region test in page "Tat cả bài viết"
        [Test]
        public void TC001_Admin_Can_Access_Article_List()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            _postPage.NavigateToPostList();
            Thread.Sleep(1500);
            Assert.That(_postPage.IsPostListPageDisplayed(), Is.True, "Không hiển thị danh sách bài viết.");
        }

        [Test]
        public void TC002_Can_Search_Post_By_Keyword()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");

            _postPage.NavigateToPostList();

            Thread.Sleep(1000);

            _postPage.SearchPost("test");

            Thread.Sleep(1000);

            Assert.That(_postPage.IsSearchResultCorrect("test"), Is.True, "Không tìm thấy bài viết với từ khóa 'test'.");
        }

        [Test]
        public void TC003_DeletePost()
        {
            string postTitle = "Trường Đại học Kỹ thuật – Công nghệ Cần Thơ làm việc với Văn phòng Kinh tế và Văn hóa Đài Bắc";
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.NavigateToPostList();
            Thread.Sleep(1000);
            _postPage.SearchPost(postTitle);
            Thread.Sleep(1000);
            Assert.That(_postPage.DoesPostExist(postTitle), Is.True, $"Không tìm thấy bài viết: {postTitle}");
            Thread.Sleep(1000);
            _postPage.TrashPost(postTitle);
            Thread.Sleep(1000);
            bool isStillExist = _postPage.DoesPostExist(postTitle);
            Assert.That(isStillExist, Is.False, "Bài viết vẫn còn hiển thị sau khi xóa.");
        }
        #endregion

        #region test in page "Thêm bài viết mới"
        [Test]
        public void TC004_CreateNewPost_WithValidInfo()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);

            _postPage.NavigateToCreatePostPage();
            Thread.Sleep(1000);

            string title = "Bài kiểm thử";
            string content = "Nội dung kiểm thử";

            _postPage.FillPostTitle(title);
            _postPage.FillPostContent(content);
            _postPage.PublishPost();

            Thread.Sleep(1500);

            Assert.That(_postPage.IsPostCreated(), Is.True, "Không thấy thông báo 'Bài viết đã được xuất bản.'");
        }

        [Test]
        public void TC005_CreateNewPost_WithTitleEmpty()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);

            _postPage.NavigateToCreatePostPage();
            Thread.Sleep(1000);

            string title = "";
            string content = "Nội dung kiểm thử";

            _postPage.FillPostTitle(title);
            _postPage.FillPostContent(content);
            _postPage.PublishPost();

            Thread.Sleep(1500);

            Assert.That(_postPage.IsPostCreated(), Is.False, "Sai TC - Thấy thông báo 'Bài viết đã được xuất bản.'");
        }

        [Test]
        public void TC006_CreateNewPost_WithContentEmpty()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);

            _postPage.NavigateToCreatePostPage();
            Thread.Sleep(1000);

            string title = "Bài kiểm thử";
            string content = "";

            _postPage.FillPostTitle(title);
            _postPage.FillPostContent(content);
            _postPage.PublishPost();

            Thread.Sleep(1500);

            Assert.That(_postPage.IsPostCreated(), Is.False, "Sai TC - Thấy thông báo 'Bài viết đã được xuất bản.'");
        }

        #endregion

        #region "Sửa bài viết"
        [Test]
        public void TC007_EditPost_WithValidInfo()
        {
            string postTitle = "Bài kiểm thử";
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.NavigateToPostList();
            Thread.Sleep(1000);
            _postPage.SearchPost(postTitle);
            Thread.Sleep(1000);
            Assert.That(_postPage.DoesPostExist(postTitle), Is.True, $"Không tìm thấy bài viết: {postTitle}");
            Thread.Sleep(1000);
            _postPage.EditPost(postTitle, "avc", "abc");
            Thread.Sleep(1000);
            Assert.That(_postPage.IsPostUpdated(), Is.True, "Không thấy thông báo 'Bài viết đã được cập nhật.'");
        }

        #endregion

        #region Danh muc
        [Test]
        public void TC008_CreateNewCategory_WithValidInfo()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToCategoryPage();
            Thread.Sleep(1000);
            string categoryName = "Danh mục kiểm thử 123";
            _postPage.CreateNewCategory(categoryName);
            Thread.Sleep(1500);
            Assert.That(_postPage.IsCategoryCreated(), Is.True);
        }

        [Test]
        public void TC010_CreateNewCategory_WithEmpty()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToCategoryPage();
            Thread.Sleep(1000);
            string categoryName = "";
            _postPage.CreateNewCategory(categoryName);
            Thread.Sleep(1500);
            Assert.That(_postPage.IsCategoryCreateEmptyCtg(), Is.True);
        }

        [Test]
        public void TC009_CreateNewCategory_WithDup()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToCategoryPage();
            Thread.Sleep(1000);
            string categoryName = "Danh mục kiểm thử";
            _postPage.CreateNewCategory(categoryName);
            Thread.Sleep(1500);
            Assert.That(_postPage.IsCategoryCreateDupCtg(), Is.True);
        }

        [Test]
        public void TC011_DeleteCategory_WithValidCategory()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToCategoryPage();

            string categoryName = "Danh mục kiểm thử";
            Thread.Sleep(1000);
            Assert.That(_postPage.IsCategoryExists(categoryName), Is.True, "Danh mục không tồn tại!");
            Thread.Sleep(1000);
            _postPage.DeleteCategory(categoryName);
            Thread.Sleep(3000);
            Assert.That(_postPage.IsCategoryExists(categoryName), Is.False, "Danh mục chưa bị xóa khỏi danh sách!");
        }
        #endregion

        #region The
        [Test]
        public void TC012_CreateNewTag_WithValidInfo()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToTagPage();
            Thread.Sleep(1000);
            string categoryName = "Thẻ kiểm thử 123";
            _postPage.CreateNewCategory(categoryName);
            Thread.Sleep(1500);
            Assert.That(_postPage.IsTagCreated(), Is.True);
        }

        
        [Test]
        public void TC013_CreateNewCategory_WithDup()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToTagPage();
            Thread.Sleep(1000);
            string categoryName = "Thẻ kiểm thử 123";
            _postPage.CreateNewCategory(categoryName);
            Thread.Sleep(1500);
            Assert.That(_postPage.IsTagCreateDupCtg(), Is.True);
        }

        [Test]
        public void TC014_DeleteCategory_WithValidCategory()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToTagPage();

            string categoryName = "Thẻ kiểm thử 123";
            Thread.Sleep(1000);
            Assert.That(_postPage.IsCategoryExists(categoryName), Is.True, "Danh mục không tồn tại!");
            Thread.Sleep(1000);
            _postPage.DeleteCategory(categoryName);
            Thread.Sleep(3000);
            Assert.That(_postPage.IsCategoryExists(categoryName), Is.False, "Danh mục chưa bị xóa khỏi danh sách!");
        }



        [Test]
        public void TC015_EditTag()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToTagPage();

            string categoryName = "123";
            Thread.Sleep(1000);
            Assert.That(_postPage.IsCategoryExists(categoryName), Is.True, "Danh mục không tồn tại!");
            Thread.Sleep(1000);
            _postPage.EditTag(categoryName, "Ther 123");
            Thread.Sleep(3000);
            Assert.That(_postPage.IsUpdate(), Is.True);
        }

        [Test]
        public void TC016_CreateNewCategory_WithEmpty()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _postPage.GoToTagPage();
            Thread.Sleep(1000);
            string categoryName = "";
            _postPage.CreateNewCategory(categoryName);
            Thread.Sleep(1500);
            Assert.That(_postPage.IsCategoryCreateEmptyCtg(), Is.True);
        }

        #endregion

        [TearDown]
        public void TearDown()
        {
            Driver.Quit();
        }

    }
}
