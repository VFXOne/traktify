package ch.calu.traktify_backend.services.utils;

public class RetryRequestHelper {

    public interface RetryProvider {
        void execute() throws Exception;
    }

    public interface RetryErrorHandler {
        void onError(Exception e);

    }

    public static void callWithRetry(RetryProvider provider, RetryErrorHandler errorHandler) {
        callWithRetry(provider, errorHandler, 1);
    }

    public static void callWithRetry(RetryProvider provider, RetryErrorHandler errorHandler, int nbRetry) {
        while (nbRetry >= 0) {
            try {
                nbRetry--;
                provider.execute();
            }
            catch (Exception e) {
                if (nbRetry >= 0) {
                    errorHandler.onError(e);
                }
                else {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
