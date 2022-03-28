import AppHeader from "../app-header/app-header";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { FC, useCallback, useEffect, useState } from "react";
import HomePage from "../../pages/home/home";
import LoginPage from "../../pages/login/login";
import RegisterPage from "../../pages/register/register";
import ForgotPasswordPage from "../../pages/forgot-password/forgot-password";
import ResetPasswordPage from "../../pages/reset-password/reset-password";
import { useDispatch, useSelector } from "../../services/hooks";
import { getProfileThunk, refreshTokenThunk } from "../../services/action/user";
import ProfilePage from "../../pages/profile/profile";
import { getIngredientItemsThunk } from "../../services/action/burger-ingredients";
import { setInterval } from "timers";
import { getCookie } from "../../services/utils";
import { REFRESH_TOKEN } from "../../services/constant";
import { ProtectedRoute } from "../protected-route/protected-route";
import Modal from "../modal/modal";
import IngredientPage from "../../pages/ingredient/ingredient";
import NotFoundPage from "../../pages/not-found/not-found";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { Location } from "history";
import FeedPage from "../../pages/feed/feed";
import OrderPage from "../../pages/order-info/order-info";
import OrderHistoryPage from "../../pages/order-history/order-history";

const App: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.userInfo.user);
  const [isUserLoaded, setUserLoaded] = useState(false);
  const location = useLocation<{
    background?: Location;
  }>();
  const history = useHistory();

  const init = async () => {
    await dispatch(getIngredientItemsThunk());
    await dispatch(getProfileThunk());
    setUserLoaded(true);
  };

  useEffect(() => {
    init();
    setInterval(() => {
      dispatch(refreshTokenThunk(getCookie(REFRESH_TOKEN)));
    }, 1000 * 60 * 20);
  }, []);

  const handelCloseModal = useCallback(() => {
    history.goBack();
  }, [history]);

  const background =
    history.action === "PUSH" && location.state && location.state.background;
  return (
    <>
      <AppHeader />
      <Switch location={background || location}>
        <Route path="/" exact={true} component={HomePage}></Route>
        <Route path="/login" component={LoginPage}></Route>
        <Route path="/register" component={RegisterPage}></Route>
        <Route path="/forgot-password" component={ForgotPasswordPage}></Route>
        <Route path="/reset-password" component={ResetPasswordPage}></Route>
        <ProtectedRoute
          path={`/profile`}
          exact={true}
          user={user}
          isUserLoaded={isUserLoaded}
        >
          <ProfilePage />
        </ProtectedRoute>
        <Route path="/ingredients/:id" component={IngredientPage}></Route>
        <Route path="/feed/:id" component={OrderPage}></Route>
        <Route path="/feed" component={FeedPage}></Route>
        <Route path="/profile/orders" component={OrderHistoryPage}></Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>

      {background && (
        <Route path="/ingredients/:id">
          <Modal onClose={handelCloseModal} title="Детали ингредиента">
            <IngredientDetails />
          </Modal>
        </Route>
      )}
    </>
  );
};

export default App;
