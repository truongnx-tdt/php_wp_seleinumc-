using NUnit.Framework;
using SeleniumTesting.Base;
using SeleniumTesting.Pages;

namespace SeleniumTesting.TestCases
{
    public class MemberTest : BaseTest
    {
        private MemberPage _memberPage;
        private LoginPage _loginPage;
        [SetUp]
        public void Setup()
        {
            _memberPage = new MemberPage(Driver);
            _loginPage = new LoginPage(Driver);
        }
        [Test]
        public void TC001_AddNewUser_WithValidInformation()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);
            _memberPage.GoToAddNewUserPage();
            Thread.Sleep(1000);
            string username = "testuser1";
            string email = "test1@example.com";
            string password = "123456789";
            _memberPage.CreateNewUser(username, email, password);
            Thread.Sleep(1500);
            Assert.That(_memberPage.IsUserDisplayed(username), Is.True, $"Không thấy người dùng: {username}");
        }

        [Test]
        public void TC002_EditUser_DisplayNameSuccessfullyUpdated()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);

            _memberPage.NavigateToMemberPage();
            Thread.Sleep(1000);

            string username = "testuser1";
            _memberPage.GoToEditUserPage(username);
            Thread.Sleep(1000);

            string newDisplayName = "Test User Updated";
            _memberPage.UpdateDisplayName(newDisplayName);
            Thread.Sleep(1500);

            Assert.That(_memberPage.IsUpdated(), Is.True, "Cập nhật không thành công.");
        }

        [Test]
        public void TC003_DeleteUser_Successfully()
        {
            _loginPage.NavigateToLoginPage();
            _loginPage.Login("test", "123456789"); 
            Thread.Sleep(1000);

            _memberPage.NavigateToMemberPage();
            Thread.Sleep(1000);
            string username = "testuser1";

            _memberPage.DeleteUser(username);
            Thread.Sleep(1500);

            bool isUserStillExist = _memberPage.IsUserExist(username);
            Assert.That(isUserStillExist, Is.False, $"Người dùng '{username}' vẫn còn tồn tại sau khi xóa.");
        }

        [Test]
        public void TC004_SearchUser_DisplayCorrectResult()
        {
            _loginPage.NavigateToLoginPage();
            Thread.Sleep(1000);
            _loginPage.Login("test", "123456789");
            Thread.Sleep(1000);

            _memberPage.NavigateToMemberPage();
            Thread.Sleep(1000);

            string keyword = "test";
            _memberPage.SearchUser(keyword);
            Thread.Sleep(1000);

            bool result = _memberPage.IsUserExistWithKeyword(keyword);
            Assert.That(result, Is.True, $"Không tìm thấy người dùng nào với từ khóa: {keyword}");
        }
    }
}
