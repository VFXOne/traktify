package ch.calu.traktify_backend.services.utils;

import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.requests.data.AbstractDataRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PagingRequestHelper {
    public interface NextProvider<E> {
        AbstractDataRequest<Paging<E>> getNextRequest(int previousCount);
    }

    public static <E> List<E> getAllElements(NextProvider<E> nextProvider) {
        List<E> finalList = new ArrayList<>();

        int offset = 0;
        int count = 0;
        int total = Integer.MAX_VALUE;

        while (count < total) {
            try {
                final Paging<E> request = nextProvider.getNextRequest(offset).execute();

                int elementsInRequest = request.getLimit();
                count += elementsInRequest;
                offset += elementsInRequest;
                total = request.getTotal();

                finalList.addAll(Arrays.asList(request.getItems()));
            }
            catch (IOException | ParseException | SpotifyWebApiException e) {
                //throw new RuntimeException(e);
                System.err.println(e.getMessage());
            }
        }

        return finalList;
    }
}
